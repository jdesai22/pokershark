import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../config.js";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // Add any other user properties you want to store
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    console.log("Signing up with email:", email, "and password:", password);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
      setUser(userData);
      setIsAuthenticated(true);
      return userCredential;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    // console.log("Signing in with email:", email, "and password:", password);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
      setUser(userData);
      setIsAuthenticated(true);
      // console.log("User signed in:", userData);
      return userCredential;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const updateUser = async (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUser,
  };
};
