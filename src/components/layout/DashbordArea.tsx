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
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { LoadingIcon } from "../ui/LoadingIcon";

// ユーザー情報を取得する関数
export const DashbordArea: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading状態を追加
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      if (!user) return;

      const userTripsRef = collection(db, "trips");
      const q = query(userTripsRef, where("createdBy", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userTrips = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const tripData = doc.data();
          const sharedUserNames = await fetchUserNames([
            ...tripData.sharedWith,
            tripData.createdBy,
          ]);
          return {
            id: doc.id,
            ...tripData,
            startDate: tripData.startDate.toDate(),
            endDate: tripData.endDate.toDate(),
            sharedUsers: sharedUserNames,
          };
        })
      );

      const sharedTripsRef = collection(db, "trips");
      const sharedQuery = query(
        sharedTripsRef,
        where("sharedWith", "array-contains", user.uid)
      );
      const sharedSnapshot = await getDocs(sharedQuery);
      const sharedTrips = await Promise.all(
        sharedSnapshot.docs.map(async (doc) => {
          const tripData = doc.data();
          const sharedUserNames = await fetchUserNames([
            ...tripData.sharedWith,
            tripData.createdBy,
          ]);
          return {
            id: doc.id,
            ...tripData,
            startDate: tripData.startDate.toDate(),
            endDate: tripData.endDate.toDate(),
            sharedUsers: sharedUserNames,
          };
        })
      );

      const allTrips = [...userTrips, ...sharedTrips];
      allTrips.sort((a, b) => a.startDate - b.startDate);

      setTrips(allTrips);
      setIsLoading(false); // データ取得完了後、Loading状態をfalseにする
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
      setIsLoading(false); // エラー発生時でもLoading状態をfalseにする
    }
  };

  const fetchUserNames = async (userIds: string[]) => {
    try {
      const userNames = [];
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
    <Box sx={{ marginTop: 4, padding: 2 }}>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <LoadingIcon />
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: 6, fontWeight: "bold" }}
          >
            旅行一覧
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {trips.map((trip) => (
              <Card
                key={trip.id}
                sx={{
                  width: "100%",
                  maxWidth: 370,
                  boxShadow: 3,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 6,
                  },
                  padding: 3,
                  borderRadius: 2,
                  background: "white",
                  marginBottom: 4,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    {trip.tripName}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: "#3f51b5" }} />
                    <Typography variant="h6">
                      {trip.startDate.toLocaleDateString()} -{" "}
                      {trip.endDate.toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: "#4caf50" }} />
                    <Typography variant="h6">{trip.budget}円</Typography>
                  </Box>
                  <Typography sx={{ my: 2 }}>
                    <PeopleAltIcon />
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {trip.sharedUsers.length > 0 ? (
                      trip.sharedUsers.map((user: string, index: number) => (
                        <Chip
                          key={index}
                          label={user}
                          variant="outlined"
                          sx={{
                            borderColor: "#00796b",
                            color: "#00796b",
                            backgroundColor: "rgba(0, 121, 107, 0.1)",
                          }}
                        />
                      ))
                    ) : (
                      <Typography>なし</Typography>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-evenly", mt: 2 }}>
                  <IconButton
                    onClick={() => navigate(`/dashboard/${trip.id}`)}
                    color="secondary"
                  >
                    <ArticleIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    onClick={() => navigate(`/dashboard/edit/${trip.id}`)}
                    color="secondary"
                  >
                    <ModeEditIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteTrip(trip.id)}
                    color="error"
                  >
                    <DeleteForeverIcon fontSize="large" />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};
