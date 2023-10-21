import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Box, Modal, TextField, Typography } from "@mui/material";

import classes from "./DowngradeDomainModal.module.css";

const DowngradeDomainModal = ({ open, setOpen, domainData, setDomainData }) => {
  const auth = useSelector((state) => state.auth);
  const businessId = localStorage.getItem("businessId");
  const enterpriseId = localStorage.getItem("enterpriseId");

  const [mailboxNo, setMailboxNo] = useState(0);
  const [domainStat] = useState(
    domainData?.find((domain) => domain.domain === open.domain)
  );

  const [loading, setLoading] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "DM Sans !important",
    maxWidth: "90%",
  };

  const submitDowngradeDomainHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75"
    );
    myHeaders.append("uuid", `${auth.id}`);

    // console.log(open);

    const body = JSON.stringify({
      no_mailbox: mailboxNo,
      domain: domainStat.domain,
      subscriptionId: domainStat.subscriptionId,
      customer_uuid: open.uuid,
      plan_id:
        domainStat.product_name === "Business Emails"
          ? businessId
          : enterpriseId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body,
      redirect: "follow",
    };

    if (mailboxNo) {
      var response = await fetch(
        `https://api.inspedium.email/downgrade-subscription?isAdmin=${true}`,
        requestOptions
      );
    } else {
      toast.error("Please specify the no of mailboxes first!");
      setLoading(false);
      return;
    }

    const responseData = await response.json();
    if (responseData?.status) {
      toast.success(responseData.msg);
      setDomainData(null);
      setOpen(false);
    } else {
      toast.error(responseData.msg || "Some error occurred, please try later!");
    }

    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          sx={{
            margin: 0,
            background:
              "linear-gradient(136.37deg, #393053 -2.34%, #635985 105.08%)",
            padding: "0.5rem 1rem",
            color: "white",
          }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          Downgrade Domain
        </Typography>
        <form
          onSubmit={submitDowngradeDomainHandler}
          className={classes["create-modal-form"]}
        >
          <label htmlFor="mailboxNo">No. of mailboxes: </label>
          <TextField
            id="mailboxNo"
            name="mailboxNo"
            placeholder=""
            label=""
            type="number"
            variant="outlined"
            disabled={loading}
            InputProps={{ inputProps: { min: 1, max: domainStat?.no_mailbox } }}
            onChange={(event) => setMailboxNo(event.target.value)}
            onKeyPress={(event) => {
              event.preventDefault();
            }}
          />
          <div className={classes.rules}>
            <p>Note: </p>
            <ul>
              <li>
                You can't go beyond the number of your current mailboxes i.e.{" "}
                {domainStat?.no_mailbox}
              </li>
              <li>
                You can't go less than the number of currently assigned
                mailboxes.
              </li>
            </ul>
          </div>
          <div className={classes["submit-buttons"]}>
            <button type="submit" disabled={loading} className="color-button">
              {loading ? "Please Wait..." : "Downgrade"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="color-inverse-button"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default DowngradeDomainModal;
