import {
  MenuTwoTone as MenuIcon,
  HomeTwoTone as HomeTwoToneIcon,
  PeopleOutlineTwoTone as PeopleOutlineTwoToneIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import NotificationContext from "../context/NotificationContext";
import UserContext from "../context/UserContext";

const Navigation = () => {
  const { setSuccessNotification } = useContext(NotificationContext);
  const { userSession, clearUserSession } = useContext(UserContext);

  const handleLogout = () => {
    clearUserSession();
    setSuccessNotification("Logged out successfully");
  };

  const [navAnchorElement, setNavAnchorElement] = useState(null);

  const handleOpenNavMenu = (event) => {
    setNavAnchorElement(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setNavAnchorElement(null);
  };

  return (
    <AppBar position="sticky" sx={{ mb: 2 }}>
      <Toolbar disableGutters sx={{ px: 2 }}>
        <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" }, mr: 2 }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={navAnchorElement}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(navAnchorElement)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuItem onClick={handleCloseNavMenu} LinkComponent={Link} to="/">
              <Typography sx={{ textAlign: "center" }}>blogs</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleCloseNavMenu}
              LinkComponent={Link}
              to="/users"
            >
              <Typography sx={{ textAlign: "center" }}>users</Typography>
            </MenuItem>
          </Menu>
        </Box>
        <Typography
          variant="h6"
          sx={{
            flexGrow: { xs: 1, md: 0 },
            mr: 2,
          }}
        >
          blog app
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex", gap: 2 },
          }}
        >
          <Button
            startIcon={<HomeTwoToneIcon />}
            LinkComponent={Link}
            to="/"
            color="inherit"
          >
            blogs
          </Button>
          <Button
            startIcon={<PeopleOutlineTwoToneIcon />}
            LinkComponent={Link}
            to="/users"
            color="inherit"
          >
            users
          </Button>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          {userSession && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {userSession.name} logged in{" "}
              </Typography>
              <Button onClick={handleLogout} color="inherit">
                logout
              </Button>
            </Box>
          )}
          {!userSession && (
            <Button LinkComponent={Link} to="/login" color="inherit">
              login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
