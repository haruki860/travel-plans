import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { LoadingIcon } from "../ui/LoadingIcon";

export const LoginArea: React.FC = () => {
    const { isLoading, signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkUser = async () => {
        if (user?.uid) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              navigate("/dashboard");
            } else {
              navigate("/profileregister");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      };
  
      if (user) {
        checkUser();
      }
    }, [user, navigate]);
  
    const handleLogin = async () => {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error("Error during sign in:", error);
      }
    };
  
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-10">
      {isLoading && (
        <LoadingIcon />
      )}
      {!isLoading && (
        <>
          <div className="text-2xl font-bold">
            Googleアカウントでログインしてください
          </div>
          <Button onClick={handleLogin} variant="contained">
            ログイン
          </Button>
        </>
      )}
    </div>
  );
};
