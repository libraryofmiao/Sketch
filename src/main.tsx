import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { MengToSketchbookLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import "./index.css";

function App() {
  const [srcDoc, setSrcDoc] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}landing-pages/meng-to-sketchbook.html`)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load sketchbook: ${response.status}`);
        return response.text();
      })
      .then(setSrcDoc)
      .catch((error) => {
        console.error(error);
        setSrcDoc(`<body style="font-family: sans-serif; padding: 2rem;">${error.message}</body>`);
      });
  }, []);

  if (!srcDoc) return <div className="loading">Loading Sketchbook…</div>;

  return (
    <div className="shader-frame">
      <MengToSketchbookLandingPage srcDoc={srcDoc} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
