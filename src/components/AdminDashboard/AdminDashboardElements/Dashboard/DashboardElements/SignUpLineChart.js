import React from "react";
import { Line } from "react-chartjs-2";

import classes from "./ChartStyles.module.css";

const SignUpLineChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Users",
        data: [20, 10, 40, 10, 60, 5],
        borderColor: "#A700FF",
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
      <p>Monthly User Sign Up</p>
      <Line data={data} options={options} />
    </div>
  );
};

export default SignUpLineChart;
