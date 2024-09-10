import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setCurrentUser(user);
      setIsLoading(false);

      // ログイン時にusersコレクションにユーザー情報を追加
      if (user) {
        setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "",
          email: user.email || "",
          profileImage: user.photoURL || "",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, provider);
      setIsLoading(false);
    } catch (error) {
      // Handle Errors here.
      console.error(error);
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return { user, isLoading, signInWithGoogle, signOutUser, currentUser };
};
