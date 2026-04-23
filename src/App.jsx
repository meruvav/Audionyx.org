import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { routeTitles } from './constants/site';
import { useAudioTools } from './hooks/useAudioTools';
import AboutPage from './pages/AboutPage';
import CalculatorsPage from './pages/CalculatorsPage';
import MarketingLayout from './layouts/MarketingLayout';
import FrequencyGuidePage from './pages/FrequencyGuidePage';
import HearingTestPage from './pages/HearingTestPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SleepFrequenciesPage from './pages/SleepFrequenciesPage';
import SupportPage from './pages/SupportPage';
import ToneGeneratorPage from './pages/ToneGeneratorPage';
import ToolsPage from './pages/ToolsPage';

function AppRoutes() {
  const location = useLocation();
  const tools = useAudioTools();

  useEffect(() => {
    document.title = routeTitles[location.pathname] || 'Audionyx';
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<MarketingLayout status={tools.status} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/hearing-test" element={<HearingTestPage tools={tools} />} />
        <Route path="/tone-generator" element={<ToneGeneratorPage tools={tools} />} />
        <Route path="/sleep-frequencies" element={<SleepFrequenciesPage tools={tools} />} />
        <Route path="/frequency-guide" element={<FrequencyGuidePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/tools" element={<ToolsPage tools={tools} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
