import React from "react";
import { Line } from "react-chartjs-2";

import classes from "./ChartStyles.module.css";

const CreatedMailboxLineChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Business",
        data: [100, 60, 50, 70, 45, 80],
        borderColor: "#05C283",
        tension: 0.5,
      },
      {
        label: "Enterprise",
        data: [100, 50, 80, 90, 60, 50],
        borderColor: "#0095FF",
        tension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
  };

  return (
    <div className={classes["chart-parent"]}>
      <p>Monthly Mail Box Create</p>
      <Line data={data} options={options} />
    </div>
  );
};

export default CreatedMailboxLineChart;
