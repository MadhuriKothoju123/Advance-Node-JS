import React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

interface DashboardLayoutProps {
  role: string;
}

const drawerWidth = 240;
const appBarHeight = 64; // default MUI AppBar height on desktop

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
    const navigate = useNavigate();
      const token = localStorage.getItem("token");

  const handleLogin = () => {
    navigate("/login"); // navigate to your login route
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); 
  };
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: appBarHeight,
        }}
      >
        <Toolbar>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6" noWrap>
           Employee project Management
          </Typography>
             {token ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Permanent Drawer aligned below AppBar */}
 <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            top: appBarHeight, // push drawer below header
            height: `calc(100% - ${appBarHeight}px)`,
          },
        }}
      >
        <Sidebar role={role} />
      </Drawer>
      <Box
        component="main"
        sx={{
          mt: `${appBarHeight}px`, // push content below header
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Outlet />
      </Box>
     
    </Box>
  );
};

export default DashboardLayout;
