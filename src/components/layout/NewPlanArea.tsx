import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Stack,
} from "@mui/material";

export const NewPlanArea: React.FC = () => {
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [budget, setBudget] = useState(0);
  const [destinations, setDestinations] = useState<
    {
      name: string;
      date: Date;
      notes: string;
      googleMapLink: string;
    }[]
  >([]);
  const [notes, setNotes] = useState("");
  const [sharedWith, setSharedWith] = useState<string[]>([]); // 共有相手のUIDを追加

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      // ユーザーがログインしていない場合は処理を中断
      return;
    }
    try {
      const newTripRef = await addDoc(
        collection(db, "trips"), // コレクション名を "trips" に変更
        {
          tripName,
          startDate,
          endDate,
          budget,
          destinations: destinations.map((destination) => ({
            name: destination.name,
            date: destination.date.toISOString(),
            notes: destination.notes,
            googleMapLink: destination.googleMapLink,
          })),
          notes,
          sharedWith, // 共有相手のUIDをFirestoreに保存
          createdBy: user.uid, // 作成者のUIDを追加
        }
      );
      console.log(newTripRef); // newTripRefの内容をコンソールに出力
      // 旅行プランの詳細ページにリダイレクト
      navigate(`/dashboard/${newTripRef.id}`);
    } catch (error) {
      console.error("旅行プランの作成に失敗しました:", error);
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
    setDestinations((prevDestinations) => {
      const updatedDestinations = [...prevDestinations];
      if (field === "date") {
        updatedDestinations[index][field] = new Date(value as string);
      } else {
        updatedDestinations[index][field] = value as string;
      }
      return updatedDestinations;
    });
  };

  const addDestination = () => {
    setDestinations((prevDestinations) => [
      ...prevDestinations,
      {
        name: "",
        date: new Date(),
        notes: "",
        googleMapLink: "",
      },
    ]);
  };

  const addSharedUser = () => {
    setSharedWith((prevSharedWith) => [...prevSharedWith, ""]); // 空の入力欄を追加
  };

  const handleSharedUserChange = (index: number, value: string) => {
    setSharedWith((prevSharedWith) => {
      const updatedSharedWith = [...prevSharedWith];
      updatedSharedWith[index] = value;
      return updatedSharedWith;
    });
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", marginTop: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          新しい旅行プランを作成
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="旅行名"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
            <TextField
              fullWidth
              type="date"
              label="開始日"
              value={startDate.toISOString().slice(0, 10)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
            <TextField
              fullWidth
              type="date"
              label="終了日"
              value={endDate.toISOString().slice(0, 10)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
            <TextField
              fullWidth
              type="number"
              label="予算"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <Typography variant="subtitle1" gutterBottom>
              訪問先
            </Typography>
            {destinations.map((destination, index) => (
              <Stack spacing={2} key={index}>
                <TextField
                  fullWidth
                  label="名称"
                  value={destination.name}
                  onChange={(e) =>
                    handleDestinationChange(index, "name", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  type="date"
                  label="日付"
                  value={destination.date.toISOString().slice(0, 10)}
                  onChange={(e) =>
                    handleDestinationChange(
                      index,
                      "date",
                      new Date(e.target.value)
                    )
                  }
                />
                <TextField
                  fullWidth
                  label="メモ"
                  value={destination.notes}
                  onChange={(e) =>
                    handleDestinationChange(index, "notes", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="Google Maps リンク"
                  value={destination.googleMapLink}
                  onChange={(e) =>
                    handleDestinationChange(
                      index,
                      "googleMapLink",
                      e.target.value
                    )
                  }
                />
              </Stack>
            ))}
            <Button variant="contained" onClick={addDestination}>
              訪問先を追加
            </Button>
            <Typography variant="subtitle1" gutterBottom>
              共有ユーザーのUID
            </Typography>
            {sharedWith.map((uid, index) => (
              <TextField
                key={index}
                fullWidth
                label="共有ユーザーUID"
                value={uid}
                onChange={(e) => handleSharedUserChange(index, e.target.value)}
              />
            ))}
            <Button variant="contained" onClick={addSharedUser}>
              共有ユーザーを追加
            </Button>
            <TextField
              fullWidth
              label="メモ"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth>
              作成
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};