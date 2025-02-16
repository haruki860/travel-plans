import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Box, Typography, CircularProgress } from "@mui/material";
import { CalendarEvent } from "../../types/type";

const localizer = momentLocalizer(moment);

export const CalendarArea: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Firestore の users コレクションから、認証ユーザーの内部 userId を取得する関数
  const getInternalUserId = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().userId;
      }
    } catch (error) {
      console.error("内部ユーザーIDの取得に失敗しました:", error);
    }
    return null;
  };

  const fetchTrips = async () => {
    if (!user) return;
    try {
      const internalUserId = await getInternalUserId(user.uid);
      if (!internalUserId) return;

      const tripsCollectionRef = collection(db, "trips");
      // sharedWith 配列に内部 userId が含まれている旅行プランを取得
      const q = query(
        tripsCollectionRef,
        where("sharedWith", "array-contains", internalUserId)
      );
      const querySnapshot = await getDocs(q);

      const trips = querySnapshot.docs.map((doc) => {
        const tripData = doc.data();
        return {
          id: doc.id,
          title: tripData.tripName,
          start: tripData.startDate.toDate(),
          end: tripData.endDate.toDate(),
        };
      });
      console.log(trips);
      setEvents(trips);
      setIsLoading(false);
    } catch (error) {
      console.error("旅行データの取得に失敗しました:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const handleSelectEvent = (event: any) => {
    navigate(`/dashboard/${event.id}`);
  };

  return (
    <Box
      sx={{
        paddingTop: 4,
        padding: 2,
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 4,
              fontWeight: "bold",
              color: "primary.main",
              paddingTop: 4,
            }}
          >
            カレンダーで旅行を確認
          </Typography>
          <Box
            sx={{
              maxWidth: 800,
              margin: "auto",
              backgroundColor: "background.paper",
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 450 }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={(_event) => ({
                style: {
                  backgroundColor: "#3f51b5",
                  color: "#ffffff",
                  borderRadius: "4px",
                  padding: "4px",
                },
              })}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
