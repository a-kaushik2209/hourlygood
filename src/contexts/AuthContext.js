import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewSignup, setIsNewSignup] = useState(false); // Flag for new signup

  async function signup(email, password, name) {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
        uid: userCredential.user.uid,
        skills: [],
        bio: '',
        timeCredits: 2, // Changed from 0 to 2 for signup bonus
        createdAt: new Date().toISOString()
      });
      
      // Set the new signup flag
      setIsNewSignup(true);
      
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function login(email, password) {
    try {
      setError('');
      setIsNewSignup(false); // Reset the flag on login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  function logout() {
    setIsNewSignup(false); // Reset the flag on logout
    return signOut(auth);
  }

  // Function to clear the new signup flag
  function clearNewSignupFlag() {
    setIsNewSignup(false);
  }

  async function getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error getting user profile:", err);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        setCurrentUser({ ...user, profile: userProfile });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserProfile,
    error,
    isNewSignup,
    clearNewSignupFlag
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
