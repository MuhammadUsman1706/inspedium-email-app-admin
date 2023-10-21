import React from "react";
import { Line } from "react-chartjs-2";

import classes from "./ChartStyles.module.css";

const MonthlyIncomeLineChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Users",
        data: [200, 100, 400, 100, 600, 50],
        borderColor: "#A700FF",
      },
    ],
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
  };

  return (
    <div className={classes["chart-parent"]}>
      <p>Monthly Income</p>
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyIncomeLineChart;
