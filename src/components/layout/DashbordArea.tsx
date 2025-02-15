import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { LoadingIcon } from "../ui/LoadingIcon";

export const DashboardArea: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 旅行データ取得
  const fetchTrips = async () => {
    try {
      if (!user) return;

      // 自分が作成したトリップ
      const userTripsRef = collection(db, "trips");
      const q = query(userTripsRef, where("createdBy", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userTrips = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const tripData = docSnap.data();
          const sharedUserNames = await fetchUserNames([
            ...tripData.sharedWith,
            tripData.createdBy,
          ]);
          return {
            id: docSnap.id,
            ...tripData,
            startDate: tripData.startDate.toDate(),
            endDate: tripData.endDate.toDate(),
            sharedUsers: sharedUserNames,
          };
        })
      );

      // 共有されているトリップ
      const sharedTripsRef = collection(db, "trips");
      const sharedQuery = query(
        sharedTripsRef,
        where("sharedWith", "array-contains", user.uid)
      );
      const sharedSnapshot = await getDocs(sharedQuery);
      const sharedTrips = await Promise.all(
        sharedSnapshot.docs.map(async (docSnap) => {
          const tripData = docSnap.data();
          const sharedUserNames = await fetchUserNames([
            ...tripData.sharedWith,
            tripData.createdBy,
          ]);
          return {
            id: docSnap.id,
            ...tripData,
            startDate: tripData.startDate.toDate(),
            endDate: tripData.endDate.toDate(),
            sharedUsers: sharedUserNames,
          };
        })
      );

      // 全件まとめて日付順にソート
      const allTrips = [...userTrips, ...sharedTrips];
      allTrips.sort((a, b) => a.startDate - b.startDate);

      setTrips(allTrips);
      setIsLoading(false);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
      setIsLoading(false);
    }
  };

  // ユーザー名一覧取得
  const fetchUserNames = async (userIds: string[]) => {
    try {
      const userNames: string[] = [];
      for (const uid of userIds) {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          userNames.push(userData.nickname);
        }
      }
      return userNames;
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました:", error);
      return [];
    }
  };

  // マウント時にデータ取得
  useEffect(() => {
    fetchTrips();
  }, [user]);

  // 旅行削除
  const handleDeleteTrip = async (tripId: string) => {
    if (!user) return;
    if (window.confirm("本当に削除しますか？")) {
      const tripRef = doc(db, "trips", tripId);
      await deleteDoc(tripRef);
      setTrips(trips.filter((trip) => trip.id !== tripId));
    }
  };

  return (
      <Box
        sx={{
          paddingTop: 4,
          padding: 2,
          backgroundColor: "background.default",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <LoadingIcon />
          </Box>
        ) : (
          <>
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 6,
                fontWeight: "bold",
                color: "#303f9f",
                paddingTop: 4
              }}
            >
              旅行一覧
            </Typography>

            {/* カードを並べるエリア */}
            <Box
              sx={{
                display: "grid",
                gap: 4,
                padding: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
              }}
            >
              {trips.map((trip) => (
                <Card
                  key={trip.id}
                  sx={{
                    boxShadow: 3,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: 6,
                    },
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                  }}
                >
                  <CardContent>
                    {/* 旅行名 */}
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      {trip.tripName}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    {/* 期間 */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary" }}
                      >
                        <CalendarTodayIcon
                          sx={{
                            verticalAlign: "middle",
                            mr: 1,
                            color: "primary.main",
                          }}
                        />
                        期間
                      </Typography>
                      <Typography variant="body1">
                        {trip.startDate.toLocaleDateString()} -{" "}
                        {trip.endDate.toLocaleDateString()}
                      </Typography>
                    </Box>

                    {/* 予算 */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary" }}
                      >
                        <AttachMoneyIcon
                          sx={{
                            verticalAlign: "middle",
                            mr: 1,
                            color: "primary.main",
                          }}
                        />
                        予算
                      </Typography>
                      <Typography variant="body1">{trip.budget}円</Typography>
                    </Box>

                    {/* 参加者 */}
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary" }}
                      >
                        <PeopleAltIcon
                          sx={{
                            verticalAlign: "middle",
                            mr: 1,
                            color: "primary.main",
                          }}
                        />
                        参加者
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {trip.sharedUsers.length > 0 ? (
                        trip.sharedUsers.map(
                          (userName: string, index: number) => (
                            <Chip
                              key={index}
                              label={userName}
                              variant="outlined"
                              sx={{
                                borderColor: "primary.main",
                                color: "primary.main",
                                backgroundColor: "rgba(63,81,181,0.08)",
                              }}
                            />
                          )
                        )
                      ) : (
                        <Typography>なし</Typography>
                      )}
                    </Box>
                  </CardContent>

                  {/* 操作アイコン */}
                  <CardActions sx={{ justifyContent: "space-around", mt: 2 }}>
                    <Tooltip title="詳細を見る">
                      <IconButton
                        onClick={() => navigate(`/dashboard/${trip.id}`)}
                        color="primary"
                      >
                        <ArticleIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="編集する">
                      <IconButton
                        onClick={() => navigate(`/dashboard/edit/${trip.id}`)}
                        color="primary"
                      >
                        <ModeEditIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="削除する">
                      <IconButton
                        onClick={() => handleDeleteTrip(trip.id)}
                        color="error"
                      >
                        <DeleteForeverIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Box>
  );
};
