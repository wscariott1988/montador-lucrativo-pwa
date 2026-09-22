import { useAppData } from '../context/AppDataContext';
import BusinessDataForm from '../components/settings/BusinessDataForm';
import BusinessModelForm from '../components/settings/BusinessModelForm';
import ToolsManager from '../components/settings/ToolsManager';
import LoadingCard from '../components/ui/LoadingCard';

export default function SettingsView() {
  const { profile, loading } = useAppData();

  return (
    <section className="flex flex-col gap-5 pb-8">
      {loading || !profile ? (
        <LoadingCard label="Carregando configurações..." />
      ) : (
        <>
          <BusinessDataForm />
          <BusinessModelForm />
          <ToolsManager />
        </>
      )}
    </section>
  );
}