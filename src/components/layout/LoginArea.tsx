import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { LoadingIcon } from "../ui/LoadingIcon";

export const LoginArea: React.FC = () => {
  const { isLoading, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(true); // ロゴ表示状態

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLogo(false); // 1.5秒後にロゴを非表示にする
    }, 3000); // 1500ミリ秒 = 1.5秒

    return () => clearTimeout(timeoutId); // コンポーネントがアンマウントされたときにタイマーをクリアする
  }, []);

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-10">
      {showLogo && ( // ロゴ表示状態に応じてロゴを表示
        <LoadingIcon />
      )}
      {!isLoading && !showLogo && ( // isLoadingがfalseかつロゴが非表示の場合にログイン画面を表示
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