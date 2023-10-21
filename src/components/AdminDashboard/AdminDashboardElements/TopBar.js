import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../../../redux/auth-actions";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

import classes from "./TopBar.module.css";

const TopBar = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logUserOutHandler = () => {
    try {
      dispatch(logOutUser());
      navigate("/");
    } catch (err) {
      toast.error(
        "Dear User, couldn't log you out 💔. Why don't you stay around for a while?"
      );
    }
  };

  return (
    <div className={classes["top-bar"]}>
      <div>
        <h2>{props.dashboardMenu}</h2>
      </div>
      <div className={classes["drawer-button"]}>
        {window.innerWidth < 800 && (
          <Button
            style={{
              padding: 0,
              color: "#00505D",
            }}
            onClick={props.toggleDrawer}
          >
            <MenuIcon fontSize="medium" />
          </Button>
        )}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={auth.name} src="" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
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
            <MenuItem
              onClick={() => {
                setAnchorElUser(null);
                props.setDashboardMenu("Profile");
              }}
            >
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorElUser(null);
                logUserOutHandler();
              }}
            >
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </div>
    </div>
  );
};

export default TopBar;
