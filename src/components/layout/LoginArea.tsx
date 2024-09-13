import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export const LoginArea: React.FC = () => {
  const { isLoading, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const checkUser = async () => {
        if (user?.uid) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            navigate("/dashboard");
          } else {
            navigate("/profileregister");
          }
        }
      };
      checkUser();
    }
  }, [user, navigate]);

  const handleLogin = () => {
    signInWithGoogle().then(() => {});
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-10">
      <div className="text-2xl font-bold">
        Googleアカウントでログインしてください
      </div>
      {isLoading && <LinearProgress />}
      <Button onClick={handleLogin} variant="contained">
        ログイン
      </Button>
    </div>
  );
};
