import { createContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { User } from "firebase/auth";

const AuthContext = createContext<{ currentUser: User | null }>({
  currentUser: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
