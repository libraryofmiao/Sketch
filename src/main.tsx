import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  const sketchbookUrl = `${import.meta.env.BASE_URL}landing-pages/meng-to-sketchbook.html`;

  return (
    <main className="sketchbook-host">
      <iframe
        className="sketchbook-frame"
        src={sketchbookUrl}
        title="Meng To Singapore Sketchbook"
        allow="fullscreen"
        loading="eager"
      />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
