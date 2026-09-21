import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Hammer } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import LoginView from './views/LoginView';
import OnboardingView from './views/OnboardingView';
import AppLayout from './components/layout/AppLayout';
import SettingsView from './views/SettingsView';
import ClientsView from './views/ClientsView';
import NewBudgetView from './views/NewBudgetView';
import HistoryView from './views/HistoryView';
import FinanceView from './views/FinanceView';
import RadarView from './views/RadarView';
import AdminDashboard from './views/AdminDashboard';

function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-dark">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-yellow-bevel">
        <Hammer size={32} strokeWidth={2.5} className="animate-pulse" />
      </div>
      <p className="text-base font-bold uppercase tracking-wide text-primary-container">
        Montador Lucrativo
      </p>
    </div>
  );
}

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) return <SplashScreen />;

  // Nao autenticado -> tela de login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Autenticado mas sem perfil (telefone) -> onboarding do trial.
  // Excecao: o ADMIN (VITE_ADMIN_EMAIL) pode abrir o painel /admin mesmo sem perfil.
  if (!profile) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Autenticado e com perfil -> app com as 5 abas + Radar; /admin protegido.
  return (
    <Routes>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/novo" replace />} />
        <Route path="ajustes" element={<SettingsView />} />
        <Route path="clientes" element={<ClientsView />} />
        <Route path="novo" element={<NewBudgetView />} />
        <Route path="historico" element={<HistoryView />} />
        <Route path="financas" element={<FinanceView />} />
        <Route path="radar" element={<RadarView />} />
      </Route>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/app/novo" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}