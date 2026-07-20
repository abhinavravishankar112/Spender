import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, Auth as FirebaseAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real application, populate these environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Check if credentials are valid (at least apiKey must be present)
const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app: any = null;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log('Firebase initialized successfully.');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.log('Firebase configuration not found. Running in Mock Authentication mode.');
}

// Mock auth interface that replicates firebase/auth functions
class MockAuth {
  private listener: ((user: any) => void) | null = null;
  private currentUserObj: any = null;

  constructor() {
    // Check AsyncStorage for cached user
    AsyncStorage.getItem('spendr_mock_user').then((userStr) => {
      if (userStr) {
        this.currentUserObj = JSON.parse(userStr);
        if (this.listener) this.listener(this.currentUserObj);
      }
    });
  }

  get currentUser() {
    return this.currentUserObj;
  }

  onAuthStateChanged(callback: (user: any) => void) {
    this.listener = callback;
    // Call immediately with current value
    callback(this.currentUserObj);
    return () => {
      this.listener = null;
    };
  }

  async signInWithEmailAndPassword(email: string, _: string) {
    // Simple mock sign in
    const user = {
      uid: 'mock-user-123',
      email,
      displayName: email.split('@')[0],
    };
    this.currentUserObj = user;
    await AsyncStorage.setItem('spendr_mock_user', JSON.stringify(user));
    if (this.listener) this.listener(user);
    return { user };
  }

  async createUserWithEmailAndPassword(email: string, _: string) {
    // Simple mock sign up
    const user = {
      uid: 'mock-user-123',
      email,
      displayName: email.split('@')[0],
    };
    this.currentUserObj = user;
    await AsyncStorage.setItem('spendr_mock_user', JSON.stringify(user));
    if (this.listener) this.listener(user);
    return { user };
  }

  async signOut() {
    this.currentUserObj = null;
    await AsyncStorage.removeItem('spendr_mock_user');
    if (this.listener) this.listener(null);
  }
}

export const mockAuthInstance = new MockAuth();

// Expose standard interfaces
export const getAppAuth = () => {
  return isFirebaseConfigured ? auth : mockAuthInstance;
};

export const getIsFirebaseConfigured = () => isFirebaseConfigured;
export { app };
export default auth;
