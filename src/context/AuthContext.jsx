import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { signUpWithEmail, signInWithEmail, signOutUser } from '../services/authService';
import { fetchUserProfile, createTrialProfile } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const nextProfile = await fetchUserProfile(nextUser.uid);
        setProfile(nextProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = useCallback(async (uid = user?.uid) => {
    if (!uid) return null;
    const nextProfile = await fetchUserProfile(uid);
    setProfile(nextProfile);
    return nextProfile;
  }, [user?.uid]);

  const signIn = useCallback(async (email, password) => {
    await signInWithEmail(email, password);
  }, []);

  const signUp = useCallback(async (email, password) => {
    await signUpWithEmail(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
    setProfile(null);
  }, []);

  const completeOnboarding = useCallback(async ({ telefone }) => {
    if (!user) {
      const error = new Error('Sessão expirada. Faça login novamente.');
      error.code = 'user-not-authorized';
      throw error;
    }
    await createTrialProfile({ uid: user.uid, email: user.email, telefone });
    const saved = await fetchUserProfile(user.uid);
    setProfile(saved);
    return saved;
  }, [user]);

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  }
  return context;
}