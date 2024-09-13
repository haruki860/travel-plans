import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NewPlanButton } from "../ui/ NewPlanButton";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  TableContainer,
  TablePagination,
  Chip,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArticleIcon from "@mui/icons-material/Article";

// ユーザー情報を取得する関数
const fetchUserNames = async (userIds: string[]) => {
  try {
    const userNames = [];
    for (const uid of userIds) {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        userNames.push(userData.nickname); // nicknameを追加
      }
    }
    return userNames;
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました:", error);
    return [];
  }
};

export const DashbordArea: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchTrips = async () => {
    try {
      if (!user) {
        return;
      }

      const userTripsRef = collection(db, "trips");
      const q = query(userTripsRef, where("createdBy", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userTrips = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const tripData = doc.data();
          const sharedUserNames = await fetchUserNames(
            [...tripData.sharedWith, tripData.createdBy] // createdByを追加
          );
          return {
            id: doc.id,
            type: "userTrip",
            ...tripData,
            startDate: tripData.startDate.toDate(),
            endDate: tripData.endDate.toDate(),
            sharedUsers: sharedUserNames, // 共有ユーザー名を追加
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
          const sharedUserNames = await fetchUserNames(
            [...tripData.sharedWith, tripData.createdBy] // createdByを追加
          );
          return {
            id: doc.id,
            type: "sharedTrip",
            ...tripData,
            startDate: tripData.startDate.toDate(),
            endDate: tripData.endDate.toDate(),
            sharedUsers: sharedUserNames, // 共有ユーザー名を追加
          };
        })
      );

      const allTrips = [...userTrips, ...sharedTrips];
      setTrips(allTrips);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDeleteTrip = async (tripId: string) => {
    if (!user) {
      return;
    }
    if (window.confirm("本当に削除しますか？")) {
      const tripRef = doc(db, "trips", tripId);
      await deleteDoc(tripRef);
      const updatedTrips = trips.filter((trip) => trip.id !== tripId);
      setTrips(updatedTrips);
    }
  };

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
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>旅行名</TableCell>
                <TableCell>開始日</TableCell>
                <TableCell>終了日</TableCell>
                <TableCell>予算</TableCell>
                <TableCell>メンバー</TableCell>
                <TableCell>詳細</TableCell>
                <TableCell>編集</TableCell>
                <TableCell>削除</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((trip) => (
                  <TableRow key={trip.id} sx={{ cursor: "pointer" }}>
                    <TableCell>{trip.tripName}</TableCell>
                    <TableCell>{trip.startDate.toLocaleDateString()}</TableCell>
                    <TableCell>{trip.endDate.toLocaleDateString()}</TableCell>
                    <TableCell>{trip.budget}円</TableCell>
                    <TableCell>
                      {trip.sharedUsers.length > 0 ? (
                        trip.sharedUsers.map((user: string, index: number) => (
                          <Chip key={index} label={user} variant="outlined" sx={{ marginRight: 1 }} />
                        ))
                      ) : (
                        "なし"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => {
                          navigate(`/dashboard/${trip.id}`);
                        }}
                      >
                        <ArticleIcon />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => {
                          navigate(`/dashboard/edit/${trip.id}`);
                        }}
                      >
                        <ModeEditIcon />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => {
                          handleDeleteTrip(trip.id);
                        }}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={trips.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};
