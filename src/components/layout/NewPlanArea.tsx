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
  AccordionSummary,
  AccordionDetails,
  Accordion,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// --- ▼ テーマ関連をインポート ▼ ---
import { createTheme, ThemeProvider } from "@mui/material/styles";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // ダークブルー
    },
    error: {
      main: "#d32f2f", // 削除などエラー用途
    },
    text: {
      primary: "#333", // 濃いグレー
      secondary: "#666",
    },
    background: {
      default: "#f5f5f5", // ページ背景
      paper: "#ffffff", // カード等の背景
    },
  },
});

export const NewPlanArea: React.FC = () => {
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [budget, setBudget] = useState("");
  const [destinations, setDestinations] = useState<
    {
      name: string;
      date: Date;
      notes: string;
      cost: string;
      googleMapLink: string;
    }[]
  >([]);
  const [notes, setNotes] = useState("");
  const [sharedWith, setSharedWith] = useState<string[]>([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // ログインしていない場合は中断

    try {
      const newTripRef = await addDoc(collection(db, "trips"), {
        tripName,
        startDate,
        endDate,
        budget,
        destinations: destinations.map((destination) => ({
          name: destination.name,
          date: destination.date.toISOString(),
          notes: destination.notes,
          cost: destination.cost,
          googleMapLink: destination.googleMapLink,
        })),
        notes,
        sharedWith,
        createdBy: user.uid,
      });
      console.log(newTripRef);
      // 新規作成した旅行プランの詳細ページに移動
      navigate(`/dashboard/${newTripRef.id}`);
    } catch (error) {
      console.error("旅行プランの作成に失敗しました:", error);
    }
  };

  // 訪問先情報を更新
  const handleDestinationChange = (
    index: number,
    field: keyof {
      name: string;
      date: Date;
      notes: string;
      cost: string;
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

  // 訪問先を追加
  const addDestination = () => {
    setDestinations((prev) => [
      ...prev,
      { name: "", date: new Date(), notes: "", cost: "", googleMapLink: "" },
    ]);
  };

  // 共有ユーザーを追加
  const addSharedUser = () => {
    setSharedWith((prev) => [...prev, ""]); // 空欄を追加
  };

  // 共有ユーザーのUIDを更新
  const handleSharedUserChange = (index: number, value: string) => {
    setSharedWith((prevSharedWith) => {
      const updated = [...prevSharedWith];
      updated[index] = value;
      return updated;
    });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Card
          sx={{
            maxWidth: 600,
            margin: "auto",
            backgroundColor: "background.paper",
            boxShadow: 3,
            marginTop: 4
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "text.primary" }}
            >
              新しい旅行プランを作成
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {/* フォームフィールド */}
                <Box display="flex" flexWrap="wrap" gap={2}>
                  <TextField
                    fullWidth
                    label="旅行名"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    sx={{ flex: "1 1 calc(50% - 8px)" }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="開始日"
                    value={startDate.toISOString().slice(0, 10)}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    sx={{ flex: "1 1 calc(50% - 8px)" }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="予算"
                    value={budget}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(/[^0-9]/g, "");
                      setBudget(numericValue);
                    }}
                    sx={{ flex: "1 1 calc(50% - 8px)" }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="終了日"
                    value={endDate.toISOString().slice(0, 10)}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    sx={{ flex: "1 1 calc(50% - 8px)" }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* 訪問先アコーディオン */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ color: "text.primary" }}>
                      訪問先
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {destinations.map((destination, index) => (
                      <Card
                        key={index}
                        sx={{
                          marginBottom: 2,
                          backgroundColor: "background.paper",
                        }}
                      >
                        <CardContent>
                          <Stack spacing={2}>
                            <Box display="flex" flexWrap="wrap" gap={2}>
                              <TextField
                                fullWidth
                                label="名称"
                                value={destination.name}
                                onChange={(e) =>
                                  handleDestinationChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                sx={{ flex: "1 1 calc(50% - 8px)" }}
                              />
                              <TextField
                                fullWidth
                                type="date"
                                label="日付"
                                value={destination.date
                                  .toISOString()
                                  .slice(0, 10)}
                                onChange={(e) =>
                                  handleDestinationChange(
                                    index,
                                    "date",
                                    new Date(e.target.value)
                                  )
                                }
                                sx={{ flex: "1 1 calc(50% - 8px)" }}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                fullWidth
                                label="コスト"
                                value={destination.cost}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  handleDestinationChange(
                                    index,
                                    "cost",
                                    numericValue
                                  );
                                }}
                                sx={{ flex: "1 1 calc(50% - 8px)" }}
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
                                sx={{ flex: "1 1 calc(50% - 8px)" }}
                              />
                            </Box>
                            <TextField
                              fullWidth
                              label="メモ"
                              value={destination.notes}
                              onChange={(e) =>
                                handleDestinationChange(
                                  index,
                                  "notes",
                                  e.target.value
                                )
                              }
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addDestination}
                    >
                      訪問先を追加
                    </Button>
                  </AccordionDetails>
                </Accordion>

                {/* 共有ユーザーのUIDアコーディオン */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ color: "text.primary" }}>
                      共有ユーザーのUID
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {sharedWith.map((uid, index) => (
                      <TextField
                        key={index}
                        fullWidth
                        label="共有ユーザーUID"
                        value={uid}
                        onChange={(e) =>
                          handleSharedUserChange(index, e.target.value)
                        }
                        sx={{ marginBottom: 2 }}
                      />
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addSharedUser}
                    >
                      共有ユーザーを追加
                    </Button>
                  </AccordionDetails>
                </Accordion>

                {/* メモフィールド */}
                <TextField
                  fullWidth
                  label="メモ"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                {/* 作成ボタン */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  作成
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};
