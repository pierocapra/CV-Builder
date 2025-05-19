// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyANRnQ2eSzNHam-u4mj85dLrtm9I_sWD6s',
  authDomain: 'cv-builder-9a845.firebaseapp.com',
  databaseURL:
    'https://cv-builder-9a845-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'cv-builder-9a845',
  storageBucket: 'cv-builder-9a845.firebasestorage.app',
  messagingSenderId: '1045665473653',
  appId: '1:1045665473653:web:a06a2497cf8abcb63bc43c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
