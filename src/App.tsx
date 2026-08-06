/**
 * Rally Obedience Training Application
 *
 * Copyright © 2026 José María Quirós Iglesias
 * All rights reserved.
 *
 * Official Rally Obedience signs, regulatory descriptions and
 * third-party materials remain the property of their respective owners.
 *
 * See LICENSE and THIRD_PARTY_NOTICES.md.
 */
import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { db, ensureSettings } from './data/db';
import { useLiveData } from './data/useLiveData';
import { DogsSettingsPage } from './pages/DogsSettingsPage';
import { HomePage } from './pages/HomePage';
import { ProgressPage } from './pages/ProgressPage';
import { SessionPage } from './pages/SessionPage';
import { SetupPage } from './pages/SetupPage';
import { SignalDetailPage, SignalsPage } from './pages/SignalsPage';
import { PreparePage, TrainPage, TrainingModePage } from './pages/TrainPage';
import { CourseBuilderPage, CourseDetailPage, CoursesPage } from './pages/CoursesPage';
import { ExamPage } from './pages/ExamPage';
import { AuthorshipPage } from './pages/AuthorshipPage';
import { InstructionsPage } from './pages/InstructionsPage';

function RoutedApp() {
  const settings = useLiveData(ensureSettings, [], undefined);
  const dogs = useLiveData(() => db.dogs.filter((dog) => dog.archivedAt === null).count(), [], -1);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = settings?.theme ?? 'system';
  }, [settings?.theme]);

  if (dogs === -1) return <div className="splash"><img src="./brand-symbol.png" alt="" /><span>Rally O Trainer</span></div>;
  if (dogs === 0) return <Routes><Route path="/authorship" element={<main className="page"><AuthorshipPage /></main>} /><Route path="*" element={<SetupPage />} /></Routes>;
  return <Routes>
    <Route element={<AppShell />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/train" element={<TrainPage />} />
      <Route path="/train/mode" element={<TrainingModePage />} />
      <Route path="/train/prepare/:signalId" element={<PreparePage />} />
      <Route path="/signals" element={<SignalsPage />} />
      <Route path="/signals/:signalId" element={<SignalDetailPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/dogs" element={<DogsSettingsPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/new" element={<CourseBuilderPage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      <Route path="/courses/:courseId/edit" element={<CourseBuilderPage />} />
      <Route path="/exam" element={<ExamPage />} />
      <Route path="/instructions" element={<InstructionsPage />} />
      <Route path="/authorship" element={<AuthorshipPage />} />
    </Route>
    <Route path="/session/:sessionId" element={<SessionPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() { return <HashRouter><RoutedApp /></HashRouter>; }
