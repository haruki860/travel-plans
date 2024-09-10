import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',  // ダークテーマ
    primary: {
      main: '#212121',  // ダークグレー（メインカラー）
    },
    secondary: {
      main: '#616161',  // グレー（アクセントカラー）
    },
    background: {
      default: '#ffffff',  // 白
      paper: '#f5f5f5',    // モーダルやカードなどの背景色
    },
    text: {
      primary: '#212121',  // ダークグレー（テキストカラー）
      secondary: '#757575',  // グレー（サブのテキストカラー）
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#212121',  // 見出しには少し明るめの色
    },
    body1: {
      fontSize: '1rem',
      color: '#212121',  // 本文はグレーのテキスト
    },
    button: {
      textTransform: 'none',  // ボタンのテキストをすべて小文字に
    },
  },
});

export default theme;