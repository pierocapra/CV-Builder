import { getDatabase, ref, set, get } from 'firebase/database';
import app from '../firebase';

const TRY_MODE_PREFIX = 'cv_builder_try_';
const db = getDatabase(app);

export const StorageType = {
  FIREBASE: 'firebase',
  LOCAL_STORAGE: 'localStorage',
};

class StorageService {
  constructor() {
    this.currentStorageType = StorageType.LOCAL_STORAGE;
    this.userId = null;
  }

  setStorageType(type, userId = null) {
    console.log('Setting storage type:', { type, userId });
    this.currentStorageType = type;
    this.userId = userId;
  }

  async saveData(key, data) {
    const normalizedKey = key.replace(/-/g, '');
    console.log('Saving data:', {
      storageType: this.currentStorageType,
      userId: this.userId,
      key: normalizedKey,
    });

    if (this.currentStorageType === StorageType.FIREBASE && this.userId) {
      const dbRef = ref(db, `users/${this.userId}/${normalizedKey}`);
      await set(dbRef, data);
    } else {
      localStorage.setItem(
        `${TRY_MODE_PREFIX}${normalizedKey}`,
        JSON.stringify(data)
      );
    }
  }

  async getData(key) {
    const normalizedKey = key.replace(/-/g, '');
    console.log('Getting data:', {
      storageType: this.currentStorageType,
      userId: this.userId,
      key: normalizedKey,
    });

    if (this.currentStorageType === StorageType.FIREBASE && this.userId) {
      const dbRef = ref(db, `users/${this.userId}/${normalizedKey}`);
      const snapshot = await get(dbRef);
      return snapshot.exists() ? snapshot.val() : null;
    } else {
      const data = localStorage.getItem(`${TRY_MODE_PREFIX}${normalizedKey}`);
      return data ? JSON.parse(data) : null;
    }
  }

  clearTryModeData() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(TRY_MODE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }

  async migrateFromTryMode() {
    if (this.currentStorageType !== StorageType.FIREBASE || !this.userId) {
      throw new Error('Cannot migrate: User not authenticated');
    }

    // Get all try mode data
    const tryModeData = {};
    Object.keys(localStorage)
      .filter((key) => key.startsWith(TRY_MODE_PREFIX))
      .forEach((key) => {
        const actualKey = key.replace(TRY_MODE_PREFIX, '');
        tryModeData[actualKey] = JSON.parse(localStorage.getItem(key));
      });

    // Save to Firebase
    const userRef = ref(db, `users/${this.userId}`);
    await set(userRef, tryModeData);

    // Clear try mode data
    this.clearTryModeData();

    return tryModeData;
  }
}

export const storageService = new StorageService();
