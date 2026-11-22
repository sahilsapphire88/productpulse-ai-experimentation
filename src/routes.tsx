import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateExperiment from './pages/CreateExperiment';
import Hypothesis from './pages/Hypothesis';
import ExperimentDesign from './pages/ExperimentDesign';
import Results from './pages/Results';
import Decision from './pages/Decision';
import WhatIfSimulator from './pages/WhatIfSimulator';
import ExperimentHistory from './pages/ExperimentHistory';
import Metrics from './pages/Metrics';
import Documentation from './pages/Documentation';
import ExperimentDetail from './pages/ExperimentDetail';

export function RoutesComponent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateExperiment />} />
        <Route path="/hypothesis" element={<Hypothesis />} />
        <Route path="/design" element={<ExperimentDesign />} />
        <Route path="/results" element={<Results />} />
        <Route path="/decision" element={<Decision />} />
        <Route path="/simulator" element={<WhatIfSimulator />} />
        <Route path="/history" element={<ExperimentHistory />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/experiments/:id" element={<ExperimentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
