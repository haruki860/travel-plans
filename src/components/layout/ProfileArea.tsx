import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
} from "@mui/material";
import {
  Email,
  Person,
  Cake,
  AlternateEmail,
  AccountCircle,
} from "@mui/icons-material";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

export const ProfileArea: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<{
    email: string;
    googlename: string;
    nickname: string;
    birthday: string;
    userphotoURL: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData({
            email: docSnap.data().email,
            googlename: docSnap.data().name,
            birthday: docSnap.data().birthday,
            nickname: docSnap.data().nickname,
            userphotoURL: docSnap.data().profileImage,
          });
        } else {
          console.log("ユーザーデータが見つかりません");
        }
      }
    };

    fetchUserData();
  }, [user]);
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 5,
        borderRadius: 5,
        boxShadow: 3,
      }}
    >
      <CardContent>
        {/* アバター */}
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: "#1976d2" }}>
            {userData?.userphotoURL ? (
              <img
                src={userData.userphotoURL}
                alt="ユーザーのプロフィール画像"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <AccountCircle style={{ fontSize: 80 }} />
            )}
          </Avatar>
        </Box>

        {/* ユーザー情報のタイトル */}
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          ユーザー情報
        </Typography>

        {/* ユーザー情報 */}
        <Stack spacing={2}>
          {/* ユーザー名 */}
          <Box display="flex" alignItems="center">
            <Person sx={{ marginRight: 1, color: "#1976d2" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              ユーザー名:{" "}
            </Typography>
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              {userData?.googlename || "未登録"}
            </Typography>
          </Box>

          {/* メールアドレス */}
          <Box display="flex" alignItems="center">
            <Email sx={{ marginRight: 1, color: "#1976d2" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              メールアドレス:{" "}
            </Typography>
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              {userData?.email || "未登録"}
            </Typography>
          </Box>

          {/* ユーザーID */}
          <Box display="flex" alignItems="center">
            <AlternateEmail sx={{ marginRight: 1, color: "#1976d2" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              ID:{" "}
            </Typography>
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              {user?.uid || "不明"}
            </Typography>
          </Box>

          {/* ニックネーム */}
          <Box display="flex" alignItems="center">
            <Person sx={{ marginRight: 1, color: "#1976d2" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              ニックネーム:{" "}
            </Typography>
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              {userData?.nickname || "未登録"}
            </Typography>
          </Box>

          {/* 誕生日 */}
          <Box display="flex" alignItems="center">
            <Cake sx={{ marginRight: 1, color: "#1976d2" }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              誕生日:{" "}
            </Typography>
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              {userData?.birthday || "未登録"}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
