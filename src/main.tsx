import React, { useCallback, useEffect, useState } from "react";
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

function App() {
  const { manifest, error } = useManifest();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const count = manifest?.photos.length ?? 0;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
      setZoomed(false);
    },
    [count]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "Escape") setZoomed(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo]);

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

  const src = `${import.meta.env.BASE_URL}photo/${manifest.photos[index]}`;

  return (
    <main className="sketchbook">
      <header className="sketchbook__header">
        <h1>{manifest.title}</h1>
        <p>Sketchbook</p>
      </header>

      <div className="sketchbook__viewer">
        <button
          className="sketchbook__nav sketchbook__nav--prev"
          onClick={() => goTo(index - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>

        <img
          className={`sketchbook__page${zoomed ? " sketchbook__page--zoomed" : ""}`}
          src={src}
          alt={`Sketchbook page ${index + 1}`}
          onClick={() => setZoomed((z) => !z)}
        />

        <button
          className="sketchbook__nav sketchbook__nav--next"
          onClick={() => goTo(index + 1)}
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
