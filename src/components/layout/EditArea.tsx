import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import {
  TextField,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Destination,Trip } from "../../types/type";

export const EditArea: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trip, setTrip] = useState<any>({});
  const [selectedDestinationIndex, setSelectedDestinationIndex] =
    useState< number | null >(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!user || !id) {
        return;
      }

      try {
        const tripRef = doc(db, "users", user.uid, "trips", id);
        const docSnap = await getDoc(tripRef);
        if (docSnap.exists()) {
          setTrip({
            id: docSnap.id,
            ...docSnap.data(),
            startDate: docSnap.data().startDate.toDate(),
            endDate: docSnap.data().endDate.toDate(),
            destinations: docSnap.data().destinations.map((destination:Destination) => ({
              ...destination,
              date: new Date(destination.date),
            })),
          });
        } else {
         console.log("エラーが発生しました。")
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log("データの取得中にエラーが発生しました");
      }
    };

    fetchTrip();
  }, [user, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) {
      console.log("ユーザー情報または旅行IDが無効です");
      return;
    }

    try {
      const tripRef = doc(db, "users", user.uid, "trips", id);
      await updateDoc(tripRef, {
        tripName: trip.tripName,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        destinations: trip.destinations.map((destination: Destination) => ({
          ...destination,
          date: destination.date.toString(),
        })),
      });
      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log("旅行の更新に失敗しました");
    }
  };

  const handleDestinationChange = (
    index: number,
    field: keyof {
      name: string;
      date: Date;
      notes: string;
      googleMapLink: string;
    },
    value: string | Date
  ) => {
    setTrip((prevTrip: Trip) => {
      const updatedDestinations = [...prevTrip.destinations];
      if (field === "date") {
        updatedDestinations[index][field] = new Date(value as string);
      } else {
        updatedDestinations[index][field] = value as string;
      }
      return { ...prevTrip, destinations: updatedDestinations };
    });
  };

  const handleDestinationSelect = (index: number) => {
    setSelectedDestinationIndex(index);
  };

  const handleAddDestination = () => {
    setTrip((prevTrip: Trip) => ({
      ...prevTrip,
      destinations: [
        ...prevTrip.destinations,
        {
          name: "",
          date: new Date(),
          notes: "",
          googleMapLink: "",
        },
      ],
    }));
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", marginTop: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          旅行の編集
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="旅行名"
              value={trip.tripName || ""}
              onChange={(e) =>
                setTrip({ ...trip, tripName: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="開始日"
              type="date"
              value={trip.startDate ? trip.startDate.toISOString().slice(0, 10) : ""}
              onChange={(e) =>
                setTrip({ ...trip, startDate: new Date(e.target.value) })
              }
            />
            <TextField
              fullWidth
              label="終了日"
              type="date"
              value={trip.endDate ? trip.endDate.toISOString().slice(0, 10) : ""}
              onChange={(e) =>
                setTrip({ ...trip, endDate: new Date(e.target.value) })
              }
            />
            <TextField
              fullWidth
              label="予算"
              type="number"
              value={trip.budget || ""}
              onChange={(e) =>
                setTrip({ ...trip, budget: parseInt(e.target.value, 10) })
              }
            />
            <Typography variant="subtitle1" gutterBottom>
              訪問先
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="destination-select-label">訪問先</InputLabel>
              <Select
                labelId="destination-select-label"
                id="destination-select"
                value={selectedDestinationIndex ?? ''}
                onChange={(e) =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  handleDestinationSelect(e.target.value as any)
                }
              >
                {trip.destinations?.map((destination: Destination, index: number) => (
                  <MenuItem key={index} value={index}>
                    {destination.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedDestinationIndex !== null && (
              <Stack spacing={2} key={selectedDestinationIndex}>
                <TextField
                  fullWidth
                  label="名称"
                  value={
                    trip.destinations[selectedDestinationIndex].name || ""
                  }
                  onChange={(e) =>
                    handleDestinationChange(
                      selectedDestinationIndex,
                      "name",
                      e.target.value
                    )
                  }
                />
                <TextField
                  fullWidth
                  type="date"
                  label="日付"
                  value={
                    trip.destinations[selectedDestinationIndex].date
                      .toISOString()
                      .slice(0, 10)
                  }
                  onChange={(e) =>
                    handleDestinationChange(
                      selectedDestinationIndex,
                      "date",
                      new Date(e.target.value)
                    )
                  }
                />
                <TextField
                  fullWidth
                  label="メモ"
                  value={
                    trip.destinations[selectedDestinationIndex].notes || ""
                  }
                  onChange={(e) =>
                    handleDestinationChange(
                      selectedDestinationIndex,
                      "notes",
                      e.target.value
                    )
                  }
                />
                <TextField
                  fullWidth
                  label="Google Maps リンク"
                  value={
                    trip.destinations[selectedDestinationIndex]
                      .googleMapLink || ""
                  }
                  onChange={(e) =>
                    handleDestinationChange(
                      selectedDestinationIndex,
                      "googleMapLink",
                      e.target.value
                    )
                  }
                />
              </Stack>
            )}
            <Button variant="contained" onClick={handleAddDestination}>
              訪問先を追加
            </Button>
            <Button type="submit" variant="contained" color="primary">
              保存
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};
