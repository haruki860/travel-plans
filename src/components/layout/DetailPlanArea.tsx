import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

// スタイリングをカスタマイズ
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.breakpoints.down("sm")}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const DetailPlanArea: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams(); // useParams を使用して id を取得
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trip, setTrip] = useState<any | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!user || !id) {
        return;
      }
      const tripRef = doc(db, "users", user.uid, "trips", id);
      const docSnap = await getDoc(tripRef);
      if (docSnap.exists()) {
        setTrip({
          id: docSnap.id,
          ...docSnap.data(),
          startDate: docSnap.data().startDate.toDate(),
          endDate: docSnap.data().endDate.toDate(),
        });
      } else {
        console.error("No such document!");
      }
    };
    fetchTrip();
  }, [user, id]);

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* タイトル部分 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            {trip.tripName}
          </Typography>
        </Stack>
        
        {/* 情報部分 */}
        <Stack direction="row" spacing={2}>
          <Typography variant="body1" gutterBottom>
            出発日: {trip.startDate.toLocaleDateString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            帰宅日: {trip.endDate.toLocaleDateString()}
          </Typography>
        </Stack>
        <Typography variant="body1" gutterBottom>
          予算: {trip.budget}円
        </Typography>

        {/* 目的地タイトル */}
        <Typography variant="h5" component="h2" gutterBottom>
          目的地
        </Typography>

        {/* テーブル部分 */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>日付</StyledTableCell>
                <StyledTableCell>目的地</StyledTableCell>
                <StyledTableCell>メモ</StyledTableCell>
                <StyledTableCell>Google Maps</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trip.destinations.map((destination: any, index: number) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {destination.date && destination.date.toDate
                      ? destination.date.toDate().toLocaleDateString()
                      : new Date(destination.date).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell>{destination.name}</StyledTableCell>
                  <StyledTableCell>{destination.notes}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      href={destination.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: "none" }}
                    >
                      Google Maps で開く
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};