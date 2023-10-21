import React, { useState, useEffect } from "react";
import Dashboard from "./AdminDashboardElements/Dashboard/Dashboard";
import AdminUser from "./AdminDashboardElements/AdminUser/AdminUser";
import SideBar from "./AdminDashboardElements/SideBar";
import TopBar from "./AdminDashboardElements/TopBar";
import Domain from "./AdminDashboardElements/Domain/Domain";
import User from "./AdminDashboardElements/User/User";
import Invoices from "./AdminDashboardElements/Invoices/Invoices";
import { useSelector } from "react-redux";
import { Box, Drawer } from "@mui/material";

import classes from "./AdminDashboard.module.css";
import Profile from "./AdminDashboardElements/Profile/Profile";

const AdminDashboard = () => {
  const fullAccess = useSelector((state) => state.auth.fullAccess);
  const [dashboardMenu, setDashboardMenu] = useState("Domain");
  const [drawerState, setDrawerState] = useState(false);
  // Domain
  const [domainId, setDomainId] = useState(null);
  const [domainData, setDomainData] = useState(null);
  // Users
  const [userDataList, setUserDataList] = useState(null);
  // Invoice
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  // Admin Users
  const [adminUsersData, setAdminUsersData] = useState(null);

  const toggleDrawer = () => setDrawerState((prevState) => !prevState);

  useEffect(() => {
    const lastTabVisited = localStorage.getItem("lastTabVisited");
    if (lastTabVisited) {
      setDashboardMenu(lastTabVisited);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastTabVisited", dashboardMenu);
  }, [dashboardMenu]);

  return (
    <div className={classes.dashboard}>
      {document.body.clientWidth > 800 ? (
        <SideBar
          domainId={domainId}
          dashboardMenu={dashboardMenu}
          setDashboardMenu={setDashboardMenu}
          setDomainId={setDomainId}
        />
      ) : (
        <Drawer
          PaperProps={{
            sx: {
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            },
          }}
          anchor={"left"}
          open={drawerState}
          onClose={toggleDrawer}
        >
          <Box
            sx={{
              width: 250,
              overflow: "hidden",
            }}
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <SideBar
              domainId={domainId}
              dashboardMenu={dashboardMenu}
              setDashboardMenu={setDashboardMenu}
              setDomainId={setDomainId}
            />
          </Box>
        </Drawer>
      )}

      <div className={classes["dashboard-display"]}>
        <TopBar
          dashboardMenu={dashboardMenu}
          setDashboardMenu={setDashboardMenu}
          toggleDrawer={toggleDrawer}
        />

        {dashboardMenu === "Dashboard" && <Dashboard />}

        {dashboardMenu === "Domain" && (
          <Domain
            domainData={domainData}
            userDataList={userDataList}
            setDomainData={setDomainData}
            itemsPerPage={10}
          />
        )}

        {dashboardMenu === "User" && (
          <User
            userDataList={userDataList}
            setUserDataList={setUserDataList}
            setDomainData={setDomainData}
            itemsPerPage={10}
          />
        )}

        {dashboardMenu === "Invoices" && (
          <Invoices invoiceInfo={invoiceInfo} setInvoiceInfo={setInvoiceInfo} />
        )}

        {fullAccess && dashboardMenu === "Admin User" && (
          <AdminUser
            adminUsersData={adminUsersData}
            setAdminUsersData={setAdminUsersData}
          />
        )}

        {dashboardMenu === "Profile" && <Profile />}
      </div>
    </div>
  );
};

export default AdminDashboard;
