import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import app from '../firebase';
import { storageService, StorageType } from './storageService';

const auth = getAuth(app);
const db = getDatabase(app);

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = new Set();

    onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', { user: user?.uid });
      this.currentUser = user;
      if (user) {
        console.log('Setting Firebase storage for user:', user.uid);
        storageService.setStorageType(StorageType.FIREBASE, user.uid);
        // Migrate data if needed
        await this.migrateDataIfNeeded(user.uid);
      } else {
        console.log('Setting localStorage (no user)');
        storageService.setStorageType(StorageType.LOCAL_STORAGE);
      }
      this.notifyAuthStateListeners(user);
    });
  }

  async migrateDataIfNeeded(userId) {
    const keys = [
      'personalInfo',
      'additionalInfo',
      'education',
      'workExperience',
      'skills',
      'links',
    ];

    // Check if user already has data in Firebase
    const dbRef = ref(db, `users/${userId}/personalInfo`);
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      console.log('No data in Firebase, migrating from localStorage...');
      // No data in Firebase, migrate from localStorage
      const data = {};

      keys.forEach((key) => {
        const localData = localStorage.getItem(key);
        if (localData) {
          data[key] = JSON.parse(localData);
        }
      });

      if (Object.keys(data).length > 0) {
        console.log('Migrating data to Firebase:', data);
        const userRef = ref(db, `users/${userId}`);
        await set(userRef, data);
      }
    }
  }

  addAuthStateListener(listener) {
    this.authStateListeners.add(listener);
    // Immediately notify the listener of the current state
    listener(this.currentUser);
  }

  removeAuthStateListener(listener) {
    this.authStateListeners.delete(listener);
  }

  notifyAuthStateListeners(user) {
    this.authStateListeners.forEach((listener) => listener(user));
  }

  async signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  }

  async login(email, password) {
    console.log('Attempting login...');
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log('Login successful:', userCredential.user.uid);
    return userCredential.user;
  }

  async logout() {
    await signOut(auth);
  }

  async switchToTryMode() {
    if (this.currentUser) {
      await this.logout();
    }
    storageService.setStorageType(StorageType.LOCAL_STORAGE);
  }

  async resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
}

export const authService = new AuthService();
