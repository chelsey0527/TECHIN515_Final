import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";
import IntakeHistory from "./pages/IntakeHistory";
import Settings from "./pages/Settings";
import PillboxEdit from "./pages/PillboxEdit";

function App() {
  return (
    <BrowserRouter>
      <main className="h-full w-full flex">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/intake-history" element={<IntakeHistory />} />
          <Route path="/pillbox/edit/:boxId" element={<PillboxEdit />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
