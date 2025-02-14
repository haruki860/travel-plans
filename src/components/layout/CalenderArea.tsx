import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Box, Typography } from "@mui/material";

const localizer = momentLocalizer(moment);

export const CalendarArea: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTrips = async () => {
    if (!user) return;

    try {
      const userTripsRef = collection(db, "trips");
      const q = query(userTripsRef, where("createdBy", "==", user.uid));
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
    <Box sx={{ marginTop: 4, padding: 2 }}>
      {isLoading ? (
        <Typography variant="h6" align="center">
          ローディング中...
        </Typography>
      ) : (
        <>
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: 6, fontWeight: "bold" }}
          >
            カレンダーで旅行を確認
          </Typography>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={handleSelectEvent}
          />
        </>
      )}
    </Box>
  );
};
