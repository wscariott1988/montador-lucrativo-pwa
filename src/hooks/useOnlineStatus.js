import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const getOnline = () =>
    typeof navigator === 'undefined' ? true : navigator.onLine;

  const [online, setOnline] = useState(getOnline);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}