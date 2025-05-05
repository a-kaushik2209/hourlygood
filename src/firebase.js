import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYCu0pp2AjI-SZ6VukTIVbkRCHtWfavnk",
  authDomain: "hourlygood-23cdf.firebaseapp.com",
  projectId: "hourlygood-23cdf",
  storageBucket: "hourlygood-23cdf.appspot.com",
  messagingSenderId: "855722359358",
  appId: "1:855722359358:web:36e20a69194bd83be62f6f",
  measurementId: "G-87PRSV9JL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
