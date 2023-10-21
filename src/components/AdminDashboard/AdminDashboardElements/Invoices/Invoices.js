import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SendIcon from "@mui/icons-material/Send";

import classes from "./Invoices.module.css";
import { toast } from "react-toastify";

const Invoices = ({ invoiceInfo, setInvoiceInfo }) => {
  const auth = useSelector((state) => state.auth);
  const [customerId, setCustomerId] = useState(null);
  const [status, setStatus] = useState("");

  const sendInvoiceHandler = (invoice) => {
    confirmAlert({
      title: "Send Invoice Confirmation.",
      message: `Are you sure you want to send ${invoice.to_name} an invoice?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            var myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append(
              "Authorization",
              "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75"
            );
            myHeaders.append("uuid", auth.id);

            const formData = new FormData();
            // invoice.due_date = new Date(
            //   invoice?.due_date * 1000
            // ).toDateString();
            const fields = Object.keys(invoice);
            fields.forEach((field) => {
              formData.append(field, invoice[field]);
            });

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: formData,
              redirect: "follow",
            };

            const response = await fetch(
              "https://api.inspedium.email/admin/sendInvoice",
              requestOptions
            );

            const responseData = await response.json();
            if (responseData.success)
              toast.success("Invoice has been sent successfully!");
            else toast.error("Some error has occurred! Please try again!");
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  useEffect(() => {
    if (!invoiceInfo || status || customerId) {
      var myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75"
      );
      myHeaders.append("uuid", `${auth.id}`);

      const formData = new FormData();

      formData.append("limit", 20);
      customerId &&
        customerId !== "none" &&
        formData.append("customer_id", customerId);
      status && status !== "none" && formData.append("status", status);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };

      fetch(`https://api.inspedium.email/admin/invoicelist`, requestOptions)
        .then((response) => response.json())
        .then((responseData) => {
          setInvoiceInfo(responseData.data);
        });

      // fetch("https://api.inspedium.email/invoice-list123", requestOptions).then(
      //   (response) =>
      //     response.json().then((responseData) =>
      //       setInvoiceInfo((prevState) => ({
      //         ...prevState,
      //         list: responseData.data,
      //       }))
      //     )
      // );
    }
  }, [status, customerId]);

  return (
    <div className={classes.invoices}>
      <div className={classes.summary}>
        <div className={classes["summary-details"]}>
          {/* <div className={classes.text}>
            <p>
              <span>Total no. of Invoices: </span> &nbsp;
              {invoiceInfo?.next_billing_date
                ? new Date(invoiceInfo?.next_billing_date * 1000).toDateString()
                : "-"}
            </p>
            <p>
              <span>Total monthly income: </span> &nbsp;
              <div
                style={{
                  textTransform: "uppercase",
                  display: "inline",
                }}
              >
                {invoiceInfo?.total ? invoiceInfo?.total : "-"}&nbsp;
                {invoiceInfo?.currency}
              </div>
            </p>
          </div> */}
          <div className={classes["top-bar"]}>
            <Paper
              component="form"
              onSubmit={(event) => event.preventDefault()}
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
              }}
            >
              <IconButton sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Invoices"
                disabled={!invoiceInfo}
                onBlur={(event) => {
                  if (event.target.value) setCustomerId(event.target.value);
                  else setCustomerId("none");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (event.target.value) setCustomerId(event.target.value);
                    else setCustomerId("none");
                  }
                }}
                inputProps={{ "aria-label": "search google maps" }}
              />
            </Paper>
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                Select Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Select"
                name="status"
                id="status"
                onChange={(event) => setStatus(event.target.value)}
                sx={{
                  width: window.innerWidth > 700 ? "200px" : "100%",
                  maxWidth: "100%",
                }}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes["domain-table"]}>
            <table>
              <thead>
                <tr>
                  <th>Inv. Number</th>
                  <th>Date</th>
                  <th>User Email</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th> </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {invoiceInfo ? (
                  invoiceInfo.map((invoice) => (
                    <tr key={invoice?.id}>
                      <td>
                        <span className={classes["table-text"]}>
                          {invoice?.number}
                        </span>
                      </td>
                      <td>
                        <span className={classes["table-text"]}>
                          {new Date(invoice?.created * 1000).toDateString()}
                        </span>
                      </td>
                      <td>
                        <span className={classes["table-text"]}>
                          {invoice?.customer_email}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            textTransform: "uppercase",
                          }}
                          className={classes["table-text"]}
                        >
                          {invoice?.amount_due / 100} {invoice?.currency}
                        </span>
                      </td>
                      <td
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        <span className={classes["table-text"]}>
                          {invoice?.status}
                        </span>
                      </td>
                      <td className={classes.icons}>
                        <a
                          target="_blank"
                          href={invoice?.invoice_pdf}
                          style={{
                            color: "#393053",
                            cursor: "pointer",
                          }}
                        >
                          <FileCopyIcon />
                        </a>
                      </td>
                      <td
                        onClick={() =>
                          sendInvoiceHandler({
                            to_email: invoice.customer_email,
                            to_name: invoice.customer_name,
                            subId: invoice.subscription,
                            subId: invoice.subscription,
                            due_date: invoice.due_date || invoice.created,
                            amount: invoice.total,
                            currency: invoice.currency,
                            invoiceURL: invoice.hosted_invoice_url,
                          })
                        }
                        className={classes.icons}
                      >
                        <SendIcon />
                      </td>
                    </tr>
                  ))
                ) : (
                  <Fragment>
                    {[...Array(3)].map((x, i) => (
                      <tr key={i}>
                        <th>
                          <Skeleton />
                        </th>
                        <th>
                          <Skeleton />
                        </th>
                        <th>
                          <Skeleton />
                        </th>
                        <th>
                          <Skeleton />
                        </th>
                        <th>
                          <Skeleton />
                        </th>
                      </tr>
                    ))}
                  </Fragment>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
