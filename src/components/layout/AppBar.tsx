import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { alpha } from "@mui/material/styles";
import TravelPlanner from "../../../public/icons/TravelPlanner.png";

const pages = ["ダッシュボード", "プラン作成", "カレンダー"];
const settings = ["プロフィール", "ログアウト"];

export const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const userAvatar = user ? (
    <Avatar src={user.photoURL ?? ""} />
  ) : (
    <Avatar src="/static/images/avatar/2.jpg" />
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    signOutUser();
    handleCloseUserMenu();
    navigate("/login");
  };

  const handlePageClick = (page: string) => {
    switch (page) {
      case "ダッシュボード":
        navigate("/dashboard");
        break;
      case "プラン作成":
        navigate("/new-plan");
        break;
      case "プラン編集":
        navigate("/edit-plan");
        break;
      case "カレンダー":
        navigate("/calender");
        break;
      default:
        break;
    }
    handleCloseNavMenu();
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        // グラデーションを削除し、ダークブルーをベースに統一
        backgroundColor: "#3f51b5",
        color: "white",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="none">
        <Toolbar disableGutters>
          {/* ---------- ハンバーガーメニュー（小画面用） ---------- */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            {/* ▼ ナビメニュー（小画面版） ▼ */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                // メニュー背景をメインカラーに近い色 + α値で若干透過
                "& .MuiMenu-paper": {
                  backgroundColor: alpha("#3f51b5", 0.9),
                  color: "#fff",
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* ---------- ロゴ ---------- */}
          <img
            src={TravelPlanner}
            style={{ width: "200px" }}
            alt="Travel Planner"
          />

          {/* ---------- タイトル（大画面用はあえて空） ---------- */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Roboto, sans-serif",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {/* 必要ならここにアプリ名などを配置 */}
          </Typography>

          {/* ---------- タイトル（小画面用はあえて空） ---------- */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Roboto, sans-serif",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {/* 必要ならここにアプリ名などを配置 */}
          </Typography>

          {/* ---------- ナビメニュー（大画面用） ---------- */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  fontWeight: "bold",
                  "&:hover": {
                    // ホバー時は白文字の上に白系薄い背景を重ねてわずかに明るく
                    backgroundColor: alpha("#fff", 0.1),
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* ---------- ユーザーメニュー ---------- */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {userAvatar}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: "45px",
                "& .MuiMenu-paper": {
                  backgroundColor: alpha("#3f51b5", 0.9),
                  color: "white",
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === "ログアウト" ? handleLogout : handleProfileClick
                  }
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
