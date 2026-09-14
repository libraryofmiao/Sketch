import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

type Manifest = {
  title: string;
  photos: string[];
};

function useManifest() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}photo-manifest.json`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load manifest (${res.status})`);
        return res.json();
      })
      .then((data: Manifest) => setManifest(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  return { manifest, error };
}

type Flip = { fromIndex: number; direction: "next" | "prev" } | null;

function App() {
  const { manifest, error } = useManifest();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [flip, setFlip] = useState<Flip>(null);
  const [entered, setEntered] = useState(false);
  const indexRef = useRef(0);

  const count = manifest?.photos.length ?? 0;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goTo = useCallback(
    (delta: number) => {
      if (count === 0) return;
      const direction: "next" | "prev" = delta > 0 ? "next" : "prev";
      const from = indexRef.current;
      const next = (((from + delta) % count) + count) % count;
      setFlip({ fromIndex: from, direction });
      setIndex(next);
      setZoomed(false);
    },
    [count]
  );

  // Clear the flipping page once its turn animation finishes.
  useEffect(() => {
    if (!flip) return;
    const timer = setTimeout(() => setFlip(null), 520);
    return () => clearTimeout(timer);
  }, [flip]);

  // A gentle "opening the cover" flip the first time the sketchbook loads.
  useEffect(() => {
    if (!manifest || entered) return;
    const timer = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(timer);
  }, [manifest, entered]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "Escape") setZoomed(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  if (error) {
    return (
      <main className="sketchbook">
        <p className="sketchbook__error">Could not load the sketchbook: {error}</p>
      </main>
    );
  }

  if (!manifest || count === 0) {
    return (
      <main className="sketchbook">
        <p className="sketchbook__loading">Loading sketchbook…</p>
      </main>
    );
  }

  const pageUrl = (i: number) => `${import.meta.env.BASE_URL}photo/${manifest.photos[i]}`;

  return (
    <main className="sketchbook">
      <header className="sketchbook__header">
        <h1>{manifest.title}</h1>
        <p>Sketchbook</p>
      </header>

      <div className="sketchbook__viewer">
        <button
          className="sketchbook__nav sketchbook__nav--prev"
          onClick={() => goTo(-1)}
          aria-label="Previous page"
        >
          ‹
        </button>

        <div
          className={`sketchbook__stage${entered ? " sketchbook__stage--entered" : ""}`}
        >
          <img
            className={`sketchbook__page${zoomed ? " sketchbook__page--zoomed" : ""}`}
            src={pageUrl(index)}
            alt={`Sketchbook page ${index + 1}`}
            onClick={() => setZoomed((z) => !z)}
          />

          {flip && (
            <img
              key={`${flip.fromIndex}-${flip.direction}-${index}`}
              className={`sketchbook__page sketchbook__page--flip sketchbook__page--flip-${flip.direction}`}
              src={pageUrl(flip.fromIndex)}
              alt=""
              aria-hidden="true"
            />
          )}
        </div>

        <button
          className="sketchbook__nav sketchbook__nav--next"
          onClick={() => goTo(1)}
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      <footer className="sketchbook__footer">
        <span>
          Page {index + 1} of {count}
        </span>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
