import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const LoginArea: React.FC = () => {
  const { isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithGoogle().then(() => {
      navigate("/dashboard");
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