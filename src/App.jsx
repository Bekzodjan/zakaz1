import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import DoIncome from "./DoIncome";
import "rodal/lib/rodal.css";
import DoExpence from "./DoExpence";
import NotFoundPage from "./NotFound";

function App() {
  useEffect(() => {
    let options = localStorage.getItem("options2");
    if (options == null || options.length == 0) {
      let opt = [
        { label: "lak", value: "lak" },
        { label: "taxta", value: "taxta" },
        { label: "mix", value: "mix" },
        { label: "ugolnik", value: "ugolnik" },
        { label: "laminat", value: "laminat" },
        { label: "chaspak", value: "chaspak" },
        { label: "ruchka", value: "ruchka" },
      ];
      localStorage.setItem("options2", JSON.stringify(opt));
    }
  }, []);

  return (
    <div
      className="mx-auto border border-4 border-black bg-dark bg-opacity-50 rounded-4 p-2"
      style={{ maxWidth: 410 }}
    >
      <Routes>
        <Route path="/" element={<DoIncome />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/expence/:id" element={<DoExpence />} />
      </Routes>
    </div>
  );
}

export default App;
