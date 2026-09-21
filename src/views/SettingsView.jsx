import { SlidersHorizontal } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import BusinessModelForm from '../components/settings/BusinessModelForm';
import ToolsManager from '../components/settings/ToolsManager';
import LoadingCard from '../components/ui/LoadingCard';

export default function SettingsView() {
  const { profile, loading } = useAppData();

  return (
    <section className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={20} className="text-primary-container" />
        <h2 className="text-base font-semibold tracking-wide text-on-surface">
          Ajustes
        </h2>
      </div>

      {loading || !profile ? (
        <LoadingCard label="Carregando configurações..." />
      ) : (
        <>
          <BusinessModelForm />
          <ToolsManager />
        </>
      )}
    </section>
  );
}