import React, { useEffect, useState } from "react";
import { getPackagesList, getUserProfile } from "../../../../../firebase";
import {
  Box,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import classes from "./AddDomainModal.module.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddDomainModal = ({ open, setOpen, userDataList, setDomainData }) => {
  const auth = useSelector((state) => state.auth);
  const businessId = localStorage.getItem("businessId");
  const enterpriseId = localStorage.getItem("enterpriseId");
  const [packageInformation, setPackageInformation] = useState(null);
  const [domainInfo, setDomainInfo] = useState({
    oldCard: false,
    firstBillingFree: false,
  });

  const [loading, setLoading] = useState(false);

  const setDomainDataHandler = (event) => {
    setDomainInfo((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "DM Sans",
    width: "700px",
    maxWidth: "90%",
    // p: 0,
    // border: "2px solid #000",
  };

  const addDomainFormSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const userData = await getUserProfile(domainInfo.uuid);
      let headers = new Headers();
      headers.append("accept", "application/json");
      headers.append(
        "Authorization",
        "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75"
      );
      headers.append("uuid", auth.id);
      headers.append("customer", userData.stripe_id);

      const body = JSON.stringify({
        priceId:
          packageInformation[domainInfo.emailPackage].price[
            domainInfo.planDuration
          ].id,
        no_mailbox: domainInfo.emailNo,
        plan_id: domainInfo.emailPackage,
        domain: domainInfo.domain,
        existing_user: true,
        oldCard: domainInfo.oldCard,
        customer_uuid: domainInfo.uuid,
        isFree: domainInfo.firstBillingFree,
        // isAdmin: true,
      });

      var requestOptions = {
        method: "POST",
        headers,
        body,
        redirect: "follow",
      };

      const createSubscriptionResponse = await fetch(
        "https://api.inspedium.email/create-subscription?isAdmin=true",
        requestOptions
      );

      // const createSubscriptionResponseData =
      //   await createSubscriptionResponse.json();

      if (createSubscriptionResponse.ok) {
        toast.success("Domain is successfully added!");
        setOpen(false);
        setDomainData(null);
      }
    } catch (err) {
      console.log(err);
      toast.error("Couldn't create the domain.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const getData = async () => {
      const response = await getPackagesList();
      setPackageInformation(response);
    };

    getData();
  }, []);

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
          Add Domain
        </Typography>
        <form
          onSubmit={addDomainFormSubmitHandler}
          className={classes["create-modal-form"]}
        >
          <div className={classes.split}>
            <div className={classes.inputs}>
              <label htmlFor="uuid">User</label>
              <Select onChange={setDomainDataHandler} name="uuid" id="uuid">
                {userDataList?.length > 0 &&
                  userDataList?.map((user) => (
                    <MenuItem key={user.uuid} value={user.uuid}>
                      {user.email}
                    </MenuItem>
                  ))}
              </Select>
              <label htmlFor="emailNo">No. of Mailbox</label>
              <TextField
                id="emailNo"
                name="emailNo"
                type="number"
                inputProps={{ min: 1 }}
                onChange={setDomainDataHandler}
                placeholder="No of Mailbox"
                label=""
                variant="outlined"
              />

              <label htmlFor="planDuration">Choose Cycle</label>
              <div className={classes.radio}>
                <input
                  onClick={setDomainDataHandler}
                  type="radio"
                  id="monthly"
                  name="planDuration"
                  value="month"
                />
                <label for="monthly">Monthly</label>
                <br />
                <input
                  onClick={setDomainDataHandler}
                  type="radio"
                  id="yearly"
                  name="planDuration"
                  value="year"
                />
                <label for="yearly">Yearly</label>
              </div>
            </div>
            <div className={classes.inputs}>
              <label htmlFor="domain">Domain</label>
              <TextField
                id="domain"
                name="domain"
                placeholder="Enter Domain"
                label=""
                variant="outlined"
                onChange={setDomainDataHandler}
              />
              <label htmlFor="emailPackage">Package</label>
              <Select
                onChange={setDomainDataHandler}
                id="emailPackage"
                name="emailPackage"
                label="Package Name"
              >
                <MenuItem value={businessId}>Business Email</MenuItem>
                <MenuItem value={enterpriseId}>Enterprise Email</MenuItem>
              </Select>

              <div className={classes["checkboxes"]}>
                <div>
                  <input
                    type="checkbox"
                    id="oldCard"
                    name="oldCard"
                    value="oldCard"
                    checked={domainInfo.oldCard}
                    onClick={(event) =>
                      setDomainInfo((prevState) => ({
                        ...prevState,
                        oldCard: event.target.checked,
                      }))
                    }
                  />
                  <label style={{ display: "inline" }} htmlFor="oldCard">
                    Pay Now
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="firstBillingFree"
                    name="firstBillingFree"
                    value="firstBillingFree"
                    checked={domainInfo.firstBillingFree}
                    onClick={(event) =>
                      setDomainInfo((prevState) => ({
                        ...prevState,
                        firstBillingFree: event.target.checked,
                      }))
                    }
                  />
                  <label
                    style={{ display: "inline" }}
                    htmlFor="firstBillingFree"
                  >
                    Free / Manual Billing
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className={classes["submit-buttons"]}>
            <button disabled={loading} type="submit" className="color-button">
              {loading ? "Please Wait..." : "Add"}
            </button>
            <button
              disabled={loading}
              onClick={() => setOpen(false)}
              className="color-inverse-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default AddDomainModal;
