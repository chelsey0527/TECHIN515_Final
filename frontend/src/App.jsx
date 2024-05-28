import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import UpcomingSchedules from "./pages/UpcomingSchedules";
import Dashboard from "./pages/Dashboard";
import DataAnalyzation from "./pages/DataAnalyzation";
import IntakeHistory from "./pages/IntakeHistory";
import Settings from "./pages/Settings";
import PillboxEdit from "./pages/PillboxEdit";

function App() {
  return (
    <BrowserRouter>
      <main className="h-screen w-full flex">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upcoming-schedules" element={<UpcomingSchedules />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/intake-history" element={<IntakeHistory />} />
          <Route path="/data-analyzation" element={<DataAnalyzation />} />
          <Route path="/pillbox/edit/:boxId" element={<PillboxEdit />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
