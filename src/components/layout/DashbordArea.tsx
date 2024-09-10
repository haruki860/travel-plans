import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate をインポート
import { NewPlanButton } from "../ui/ NewPlanButton";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";

export const DashbordArea: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate(); // useNavigate を初期化

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        return;
      }
      const tripsRef = collection(db, "users", user.uid, "trips");
      const q = query(tripsRef);
      const querySnapshot = await getDocs(q);
      const fetchedTrips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
      }));
      setTrips(fetchedTrips);
    };
    fetchTrips();
  }, [user]);

  return (
    <>
      <Box sx={{ m: 2 }}>
        <NewPlanButton />
      </Box>
      <Paper sx={{ marginTop: 4, padding: 2, borderRadius: 2, ml: 2, mr: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">旅行一覧</Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>旅行名</TableCell>
              <TableCell>開始日</TableCell>
              <TableCell>終了日</TableCell>
              <TableCell>予算</TableCell>
              <TableCell>詳細</TableCell>
              <TableCell>編集</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip) => (
              <TableRow
                key={trip.id}
                // onClick={() => {
                //   navigate(`/dashboard/${trip.id}`);
                // }}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{trip.tripName}</TableCell>
                <TableCell>{trip.startDate.toLocaleDateString()}</TableCell>
                <TableCell>{trip.endDate.toLocaleDateString()}</TableCell>
                <TableCell>{trip.budget}円</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      navigate(`/dashboard/${trip.id}`);
                    }}
                  >
                    詳細
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      navigate(`/dashboard/edit/${trip.id}`);
                    }}
                  >
                    編集
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};
