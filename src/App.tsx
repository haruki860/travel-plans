import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResponsiveAppBar } from "./components/layout/AppBar";
import { LoginPage } from "./components/pages/LoginPage";
import { DashbordPage } from "./components/pages/DashbordPage";
import { useAuth } from "./components/hooks/useAuth";
import { NewPlanPage } from "./components/pages/NewPlanPage";
import { DetailPlanPage } from "./components/pages/DetailPlanPage";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { EditPlanPage } from "./components/pages/EditPlanPage";
const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // user が更新されたときにコンポーネントを再レンダリングする
  useEffect(() => {
    if (user && !isLoading) {
      setIsLoggedIn(true);
    }
  }, [user, isLoading]);

  console.log(user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {isLoggedIn && <ResponsiveAppBar />}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashbordPage />} />
          <Route path="/new-plan" element={<NewPlanPage />} />
          <Route path="/dashboard/:id" element={<DetailPlanPage />} />
          <Route path="/dashboard/edit/:id" element={<EditPlanPage />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
