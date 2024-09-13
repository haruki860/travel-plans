import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const RegisterArea: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (user?.uid) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "",
          email: user.email || "",
          profileImage: user.photoURL || "",
          nickname: nickname,
          birthday: birthday,
        });
        navigate("/dashboard");
      } catch (error) {
        console.error("ユーザー情報の登録に失敗しました", error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography component="h1" variant="h5">
            ユーザー情報登録
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 3 }}>
              <TextField
                required
                fullWidth
                id="nickname"
                label="ニックネーム"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                required
                fullWidth
                id="birthday"
                type="date"
                name="birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                登録
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};