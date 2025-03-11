import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@components/login/LoginPage.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<App />} />
    </Routes>
  </Router>
);
