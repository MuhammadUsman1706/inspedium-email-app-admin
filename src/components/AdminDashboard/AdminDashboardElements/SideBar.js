import React from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOutUser } from "../../../redux/auth-actions";
import LanguageIcon from "@mui/icons-material/Language";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import logo from "../../../assets/images/logo.png";

import classes from "./SideBar.module.css";

const SideBar = ({
  domainId,
  dashboardMenu,
  setDashboardMenu,
  setDomainId,
}) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logUserOutHandler = () => {
    try {
      dispatch(logOutUser());
      navigate("/");
    } catch (err) {
      toast.error("Dear User, couldn't log you out 💔. We love you dearly!");
    }
  };

  const setDashboardMenuHandler = (event) => {
    setDashboardMenu(event.target.id);
    setDomainId(null);
  };

  return (
    <div
      style={{
        maxWidth: "fit-content",
        borderRadius: 0,
      }}
      className={classes["side-bar"]}
    >
      <div className={classes.logo}>
        <Link to="/">
          <img src={logo} alt="Inspedium Email Logo" />
        </Link>
      </div>

      <div className={classes.menu}>
        {/* <button
          id="Dashboard"
          onClick={(event) => setDashboardMenuHandler(event)}
          className={
            dashboardMenu === "Dashboard"
              ? classes["active-menu-button"]
              : classes["menu-button"]
          }
        >
          <BarChartIcon />
          Dashboard
        </button> */}
        <button
          id="User"
          onClick={(event) => setDashboardMenuHandler(event)}
          className={
            dashboardMenu === "User"
              ? classes["active-menu-button"]
              : classes["menu-button"]
          }
        >
          <GroupIcon />
          User
        </button>
        <button
          id="Domain"
          onClick={(event) => setDashboardMenuHandler(event)}
          className={
            dashboardMenu === "Domain" || domainId
              ? classes["active-menu-button"]
              : classes["menu-button"]
          }
        >
          <LanguageIcon />
          Domain
        </button>

        <button
          id="Invoices"
          onClick={(event) => setDashboardMenuHandler(event)}
          className={
            dashboardMenu === "Invoices"
              ? classes["active-menu-button"]
              : classes["menu-button"]
          }
        >
          <ReceiptIcon />
          Invoices
        </button>

        {auth.fullAccess && (
          <button
            id="Admin User"
            onClick={(event) => setDashboardMenuHandler(event)}
            className={
              dashboardMenu === "Admin User"
                ? classes["active-menu-button"]
                : classes["menu-button"]
            }
          >
            <LocalPoliceIcon />
            Admin User
          </button>
        )}

        <button
          id="Profile"
          onClick={(event) => setDashboardMenuHandler(event)}
          className={
            dashboardMenu === "Profile"
              ? classes["active-menu-button"]
              : classes["menu-button"]
          }
        >
          <PersonIcon />
          Profile
        </button>
      </div>
      <button
        onClick={logUserOutHandler}
        className={`${classes["menu-button"]} ${classes["logout-button"]}`}
      >
        <LogoutIcon />
        Logout
      </button>
    </div>
  );
};

export default SideBar;
