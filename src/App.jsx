import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { StudyProvider } from './context/StudyContext';
import Layout from './components/Layout/Layout';
import SettingsModal from './components/SettingsModal';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import Revision from './pages/Revision';
import AITools from './pages/AITools';
import './App.css';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <StudyProvider>
      <BrowserRouter>
        <Layout onOpenSettings={() => setSettingsOpen(true)}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/ai-tools" element={<AITools />} />
          </Routes>
        </Layout>
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          theme="dark"
          toastStyle={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
          }}
        />
      </BrowserRouter>
    </StudyProvider>
  );
}

export default App;
