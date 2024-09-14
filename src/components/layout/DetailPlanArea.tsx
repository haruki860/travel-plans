import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Trip } from "../../types/type";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  LinearProgress,
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
    if (!trip || !user) {
      return;
    }
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
    <Box sx={{ p: 4, borderRadius: 4 }}>
      <Stack spacing={4}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ textAlign: "center", fontWeight: "bold", color: "#333" }}
        >
          {trip.tripName}
        </Typography>

        {/* 日付と予算カード */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={4} justifyContent="center">
          {/* 出発日・帰宅日カード */}
          <Card
            sx={{
              flex: 1,
              backgroundColor: "#f7f7f7",
              borderRadius: 3,
              boxShadow: 3,
              padding: 3,
              maxWidth: 400, // カードの幅を固定
              transition: "box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                出発日: {trip.startDate.toLocaleDateString()}
              </Typography>
              <Typography variant="h6">
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                帰宅日: {trip.endDate.toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>

          {/* 予算カード */}
          <Card
            sx={{
              flex: 1,
              backgroundColor: "#f0f0f0",
              borderRadius: 3,
              boxShadow: 3,
              padding: 3,
              maxWidth: 400, // カードの幅を固定
              transition: "box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              {/* 予算 */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <AttachMoneyIcon color="primary" />
                <Typography variant="h6">予算: {budget.toLocaleString()}円</Typography>
              </Stack>

              {/* 実費 */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <AttachMoneyIcon color="secondary" />
                <Typography variant="h6">実費: {totalCost.toLocaleString()}円</Typography>
              </Stack>

              {/* 残金またはオーバー */}
              {remainingBudget >= 0 ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AttachMoneyIcon sx={{ color: "#4caf50" }} />
                  <Typography variant="h6" color="green">
                    残金: {remainingBudget.toLocaleString()}円
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ErrorIcon color="error" />
                  <Typography variant="h6" color="error">
                    オーバー: {overBudget.toLocaleString()}円
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>

        {/* 目的地エリア */}
        <Typography variant="h5" component="h2" gutterBottom>
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
                padding: 2,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="h6">
                    {new Date(destination.date).toLocaleDateString()}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <FmdGoodIcon color="primary" />
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    目的地: {destination.name}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <AttachMoneyIcon sx={{ color: "#4caf50" }} />
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    コスト: {destination.cost}円
                  </Typography>
                </Stack>

                {destination.notes && (
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      メモ: {destination.notes}
                    </Typography>
                  </Stack>
                )}

                <Divider sx={{ my: 2 }} />

                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Button
                    color="primary"
                    href={destination.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
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
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};
