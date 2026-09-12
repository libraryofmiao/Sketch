import React from "react";
import ReactDOM from "react-dom/client";
import { MengToSketchbookLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="shader-frame">
      <MengToSketchbookLandingPage />
    </div>
  </React.StrictMode>,
);
