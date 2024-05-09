import React from 'react';
import {
  Routes,
  Route
} from 'react-router-dom';

import IndexPage from './pages/Index.js';
import IntakeHistoryPage from './pages/Intake_history.js';
import TrackDevicePage from './pages/Track_device.js';
import FormsPage from './pages/Forms.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
         
      <Route path="/intakehistory" element={<IntakeHistoryPage />} />
         
      <Route path="/trackdevice" element={<TrackDevicePage />} />
         
      <Route path="/forms" element={<FormsPage />} />
    </Routes>
  );
}

export default App;
