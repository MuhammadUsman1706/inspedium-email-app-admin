import React from "react";
import PurchasedMailboxBarChart from "./DashboardElements/PurchasedMailboxBarChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import classes from "./Dashboard.module.css";
import SignUpLineChart from "./DashboardElements/SignUpLineChart";
import MonthlyIncomeLineChart from "./DashboardElements/MonthlyIncomeLineChart";
import CreatedMailboxLineChart from "./DashboardElements/CreatedMailboxLineChart";
import FailedInvoices from "./DashboardElements/FailedInvoices";
import UnpaidInvoices from "./DashboardElements/UnpaidInvoices";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  return (
    <div className={classes.dashboard}>
      <div className={`${classes.row} ${classes["row-1"]}`}>
        <PurchasedMailboxBarChart />
        <SignUpLineChart />
      </div>

      <div className={`${classes.row} ${classes["row-2"]}`}>
        <MonthlyIncomeLineChart />
        <CreatedMailboxLineChart />
      </div>

      <div className={`${classes.row} ${classes["row-3"]}`}>
        <FailedInvoices />
        <UnpaidInvoices />
      </div>
    </div>
  );
};

export default Dashboard;
