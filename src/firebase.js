import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNlq3ku2raafOxs9W8TATxScoLFpPvun0",
  authDomain: "hourlygood-f6cac.firebaseapp.com",
  projectId: "hourlygood-f6cac",
  storageBucket: "hourlygood-f6cac.appspot.com",
  messagingSenderId: "821096150691",
  appId: "1:821096150691:web:614fda96c4c6733d01b116",
  measurementId: "G-ZX5QQ3Q037"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
