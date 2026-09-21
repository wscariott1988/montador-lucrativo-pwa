import { Hammer } from 'lucide-react';

export default function SplashLoader() {
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