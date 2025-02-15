import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // メインカラー（ダークブルー）
    },
    error: {
      main: "#d32f2f", // 削除・警告などのエラーカラー
    },
    text: {
      primary: "#333", // メインテキスト
      secondary: "#666", // ラベル・補足テキスト
    },
    background: {
      default: "#f5f5f5", // 全体の背景
      paper: "#ffffff", // カードの背景
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // フォントを統一
  },
});

