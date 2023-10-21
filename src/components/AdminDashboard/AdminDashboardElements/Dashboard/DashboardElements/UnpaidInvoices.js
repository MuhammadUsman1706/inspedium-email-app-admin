import React from "react";

import classes from "./Invoices.module.css";

const UnpaidInvoices = () => {
  return (
    <div className={classes["invoices"]}>
      <p>Unpaid Invoices</p>
      <table className={classes["invoices-table"]}>
        <thead>
          <tr>
            <th>Date</th>
            <th>User Email</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>22-Jan-2020</td>
            <td>tim.jennings@example.com</td>
            <td>$ 76776</td>
          </tr>
          <tr>
            <td>22-Jan-2020</td>
            <td>tim.jennings@example.com</td>
            <td>$ 76776</td>
          </tr>
          <tr>
            <td>22-Jan-2020</td>
            <td>tim.jennings@example.com</td>
            <td>$ 76776</td>
          </tr>
          <tr>
            <td>22-Jan-2020</td>
            <td>tim.jennings@example.com</td>
            <td>$ 76776</td>
          </tr>
          <tr>
            <td>22-Jan-2020</td>
            <td>tim.jennings@example.com</td>
            <td>$ 76776</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UnpaidInvoices;
