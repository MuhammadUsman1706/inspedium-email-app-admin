import React from "react";
import { Bar } from "react-chartjs-2";

import classes from "./ChartStyles.module.css";

const PurchasedMailboxBarChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
    datasets: [
      {
        label: "Business",
        backgroundColor: "#0095FF",
        data: [10, 7, 5, 10, 7, 3],
      },
      {
        label: "Enterprise",
        backgroundColor: "#00E096",
        data: [4, 3, 7, 10, 1, 6],
      },
    ],
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
  };

  return (
    <div className={classes["chart-parent"]}>
      <p>Total New Mail Box</p>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PurchasedMailboxBarChart;
