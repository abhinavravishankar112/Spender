import { create } from 'zustand';
import { getAppAuth, getIsFirebaseConfigured } from '@/services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => () => void;
}

const authService = getAppAuth();
const isRealFirebase = getIsFirebaseConfigured();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      if (isRealFirebase) {
        const credential = await signInWithEmailAndPassword(authService, email, password);
        const { uid, email: uEmail, displayName } = credential.user;
        set({ user: { uid, email: uEmail, displayName }, loading: false });
      } else {
        const credential = await authService.signInWithEmailAndPassword(email, password);
        const { uid, email: uEmail, displayName } = credential.user;
        set({ user: { uid, email: uEmail, displayName }, loading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign in', loading: false });
      throw err;
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      if (isRealFirebase) {
        const credential = await createUserWithEmailAndPassword(authService, email, password);
        await updateProfile(credential.user, { displayName: name });
        const { uid, email: uEmail, displayName } = credential.user;
        set({ user: { uid, email: uEmail, displayName: displayName || name }, loading: false });
      } else {
        const credential = await authService.createUserWithEmailAndPassword(email, password);
        const { uid, email: uEmail } = credential.user;
        set({ user: { uid, email: uEmail, displayName: name }, loading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign up', loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await signOut(authService);
      set({ user: null, loading: false });
    } catch (err: any) {
      if (!isRealFirebase) {
        await authService.signOut();
        set({ user: null, loading: false });
      } else {
        set({ error: err.message || 'Failed to sign out', loading: false });
        throw err;
      }
    }
  },

  initialize: () => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser: any) => {
      if (firebaseUser) {
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          },
          initialized: true,
        });
      } else {
        set({ user: null, initialized: true });
      }
    });

    return unsubscribe;
  },
}));
