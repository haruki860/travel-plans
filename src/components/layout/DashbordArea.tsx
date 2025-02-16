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

  // Firestore の users コレクションから、認証ユーザーに紐づく内部の userId を取得
  const getUserIdFromFirestore = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().userId;
      }
    } catch (error) {
      console.error("ユーザーIDの取得に失敗しました:", error);
    }
    return null;
  };

  const fetchTrips = async () => {
    try {
      if (!user) return;

      const firestoreUserId = await getUserIdFromFirestore(user.uid);
      if (!firestoreUserId) return;

      const tripsCollectionRef = collection(db, "trips");

      // ユーザーが作成した旅行プラン
      const qCreated = query(
        tripsCollectionRef,
        where("createdBy", "==", firestoreUserId)
      );
      const queryCreatedSnapshot = await getDocs(qCreated);
      const userTrips = await Promise.all(
        queryCreatedSnapshot.docs.map(async (docSnap) => {
          const tripData = docSnap.data();
          // createdBy と sharedWith は内部 userId なので、Dashboard 側で変換する
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

      // 共有された旅行プラン
      const qShared = query(
        tripsCollectionRef,
        where("sharedWith", "array-contains", firestoreUserId)
      );
      const querySharedSnapshot = await getDocs(qShared);
      const sharedTrips = await Promise.all(
        querySharedSnapshot.docs.map(async (docSnap) => {
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

      // 重複除去（ユーザーが作成した旅行が sharedWith にも入っている場合）
      const allTrips = [...userTrips, ...sharedTrips];
      const uniqueTripsMap = new Map();
      allTrips.forEach((trip) => {
        uniqueTripsMap.set(trip.id, trip);
      });
      const uniqueTrips = Array.from(uniqueTripsMap.values());

      uniqueTrips.sort((a, b) => a.startDate - b.startDate);

      setTrips(uniqueTrips);
      setIsLoading(false);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
      setIsLoading(false);
    }
  };

  /**
   * 保存されている内部の userId を元に、users コレクションから該当するユーザーの nickname を取得
   * ※Set を利用して重複を除去しています
   */
  const fetchUserNames = async (userIds: string[]) => {
    try {
      const userNamesSet = new Set<string>();
      for (const internalUserId of userIds) {
        const usersRef = collection(db, "users");
        // internalUserId は Firestore 内の userId フィールド
        const q = query(usersRef, where("userId", "==", internalUserId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // 複数ヒットする可能性はありますが、通常は1件
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          userNamesSet.add(userData.nickname);
        } else {
          // 該当するユーザーが見つからなければ、内部IDを追加（またはデフォルト値）
          userNamesSet.add(internalUserId);
        }
      }
      return Array.from(userNamesSet);
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
              paddingTop: 4,
            }}
          >
            旅行一覧
          </Typography>
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
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "text.primary" }}
                  >
                    {trip.tripName}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
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
                    {trip.sharedUsers && trip.sharedUsers.length > 0 ? (
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
