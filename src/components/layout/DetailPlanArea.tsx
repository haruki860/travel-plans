import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Trip } from "../../types/type";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  LinearProgress,
  Button,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ErrorIcon from "@mui/icons-material/Error";


export const DetailPlanArea: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!user || !id) {
        return;
      }
      const tripRef = doc(db, "trips", id);
      const docSnap = await getDoc(tripRef);
      if (docSnap.exists()) {
        setTrip({
          id: docSnap.id,
          ...docSnap.data(),
          startDate: docSnap.data().startDate.toDate(),
          endDate: docSnap.data().endDate.toDate(),
        } as Trip);
      } else {
        console.error("No such document!");
      }
    };
    fetchTrip();
  }, [user, id]);

  const handleDeleteDestination = async (index: number) => {
    if (!trip || !user) return;

    if (window.confirm("本当に削除しますか？")) {
      const updatedDestinations = [...trip.destinations];
      updatedDestinations.splice(index, 1);
      const tripRef = doc(db, "trips", trip.id);
      await updateDoc(tripRef, { destinations: updatedDestinations });
      setTrip({ ...trip, destinations: updatedDestinations });
    }
  };

  if (!trip) {
    return <LinearProgress />;
  }

  const totalCost = trip.destinations.reduce(
    (sum, destination) =>
      sum +
      (typeof destination.cost === "string"
        ? parseInt(destination.cost, 10)
        : destination.cost),
    0
  );
  const budget = parseInt(trip.budget.toString(), 10);
  const remainingBudget = budget - totalCost;
  const overBudget = totalCost - budget;

  return (
      <Box
        sx={{ p: 4, backgroundColor: "background.default", minHeight: "100vh" }}
      >
        <Stack spacing={4} alignItems="center">
          {/* 旅行タイトル */}
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {trip.tripName}
          </Typography>

          {/* 出発日・帰宅日＆予算カード */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
          >
            {/* 出発日・帰宅日 */}
            <Card
              sx={{
                flex: 1,
                backgroundColor: "background.paper",
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                maxWidth: 400,
              }}
            >
              <CardContent>
                <Stack direction="column" spacing={1}>
                  <Typography variant="h6">
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    出発日: {trip.startDate.toLocaleDateString()}
                  </Typography>
                  <Typography variant="h6">
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    帰宅日: {trip.endDate.toLocaleDateString()}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* 予算カード */}
            <Card
              sx={{
                flex: 1,
                backgroundColor: "background.paper",
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                maxWidth: 400,
              }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6">
                    <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                    予算: {budget.toLocaleString()}円
                  </Typography>
                  <Typography variant="h6">
                    <AttachMoneyIcon color="secondary" sx={{ mr: 1 }} />
                    実費: {totalCost.toLocaleString()}円
                  </Typography>
                  <Typography
                    variant="h6"
                    color={remainingBudget >= 0 ? "green" : "error"}
                  >
                    {remainingBudget >= 0 ? (
                      <>
                        <AttachMoneyIcon sx={{ color: "#4caf50", mr: 1 }} />
                        残金: {remainingBudget.toLocaleString()}円
                      </>
                    ) : (
                      <>
                        <ErrorIcon color="error" sx={{ mr: 1 }} />
                        オーバー: {overBudget.toLocaleString()}円
                      </>
                    )}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* 目的地エリア */}
          <Typography variant="h5" component="h2">
            目的地
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
            }}
          >
            {trip.destinations.map((destination, index) => (
              <Card
                key={index}
                sx={{
                  width: "100%",
                  maxWidth: 350,
                  boxShadow: 3,
                  borderRadius: 3,
                  p: 2,
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    {new Date(destination.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    <FmdGoodIcon color="primary" sx={{ mr: 1 }} />
                    {destination.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", mt: 2 }}
                  >
                    <AttachMoneyIcon sx={{ color: "#4caf50", mr: 1 }} />
                    コスト: {destination.cost}円
                  </Typography>
                </CardContent>
                <Divider sx={{ my: 2 }} />
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Button
                    color="primary"
                    href={destination.googleMapLink}
                    target="_blank"
                    startIcon={<FmdGoodIcon />}
                  >
                    Google Maps
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteDestination(index)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Stack>
      </Box>
  );
};
