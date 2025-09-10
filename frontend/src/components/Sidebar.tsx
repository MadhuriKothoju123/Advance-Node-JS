// Sidebar.tsx
import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import {  roleNavConfig } from "../config/rolesConfig";

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const navItems = roleNavConfig[role];

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {navItems.map((item) => (
          <ListItem  component={Link} to={item.path} key={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
