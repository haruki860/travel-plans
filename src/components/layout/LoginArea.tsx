import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const LoginArea: React.FC = () => {
  const { isLoading, signInWithGoogle,user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = () => {
    signInWithGoogle().then(() => {
    });
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