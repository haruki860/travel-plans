import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate をインポート
import { NewPlanButton } from "../ui/ NewPlanButton";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, deleteDoc, doc } from "firebase/firestore";
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
} from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArticleIcon from '@mui/icons-material/Article';

export const DashbordArea: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate(); // useNavigate を初期化

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const handleDeleteTrip = async (tripId: string) => {
    if (!user) {
      return;
    }
    if (window.confirm("本当に削除しますか？")) { // 削除確認ダイアログを追加
      const tripRef = doc(db, "users", user.uid, "trips", tripId);
      await deleteDoc(tripRef);
      // 削除後に trips を更新
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
                <TableCell>詳細</TableCell>
                <TableCell>編集</TableCell>
                <TableCell>削除</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((trip) => (
                <TableRow
                  key={trip.id}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{trip.tripName}</TableCell>
                  <TableCell>{trip.startDate.toLocaleDateString()}</TableCell>
                  <TableCell>{trip.endDate.toLocaleDateString()}</TableCell>
                  <TableCell>{trip.budget}円</TableCell>
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
                      variant='text'
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