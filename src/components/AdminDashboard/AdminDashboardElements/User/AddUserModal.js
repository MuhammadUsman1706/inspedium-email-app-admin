import React, { useState, useEffect } from "react";
import { getPackagesList } from "../../../../firebase";
import {
  Box,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import classes from "./AddUserModal.module.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import PhoneInput from "react-phone-number-input";
import { isPossiblePhoneNumber } from "react-phone-number-input";

const AddUserModal = ({ open, setOpen, setDomainData, setUserDataList }) => {
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [businessId, setBusinessId] = useState("null");
  const [enterpriseId, setEnterpriseId] = useState("null");
  const [packageInformation, setPackageInformation] = useState(undefined);
  const [userData, setUserData] = useState({ firstBillingFree: false });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "DM Sans",
    width: "700px",
    maxWidth: "90%",
  };

  const setUserDataHandler = (event) => {
    setUserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const createUserFormSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(userData.firstBillingFree);
    if (!isPossiblePhoneNumber(userData.phoneNumber)) {
      toast.error("Please enter a correct phone number!");
      return;
    }

    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75"
    );
    myHeaders.append("uuid", auth.id);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    requestOptions.body = JSON.stringify({
      email: userData.email,
      name: userData.name,
      phone: userData.phoneNumber,
      password: userData.password,
      domain: userData.domain,
      plan_id: userData.emailPackage,
      no_mailbox: userData.emailNo,
      company: userData.company,
      // isAdmin: true,
    });

    try {
      const createCustomerResponse = await fetch(
        "https://api.inspedium.email/create-customer?isAdmin=true",
        requestOptions
      );
      const createCustomerResponseData = await createCustomerResponse.json();

      if (createCustomerResponseData.error) {
        toast.error(createCustomerResponseData.error);
        setLoading(false);
        return;
      }

      // myHeaders.append("uuid", auth.id);
      myHeaders.append("customer", createCustomerResponseData.customer.id);

      requestOptions.headers = myHeaders;
      requestOptions.body = JSON.stringify({
        priceId:
          packageInformation[userData.emailPackage].price[userData.planDuration]
            .id,
        no_mailbox: userData.emailNo,
        plan_id: userData.emailPackage,
        domain: userData.domain,
        existing_user: true,
        oldCard: false,
        customer_uuid: createCustomerResponseData.user_id,
        isFree: userData.firstBillingFree,
      });

      const createSubscriptionResponse = await fetch(
        "https://api.inspedium.email/create-subscription?isAdmin=true",
        requestOptions
      );

      const createSubscriptionResponseData =
        await createSubscriptionResponse.json();

      if (createSubscriptionResponseData.subscriptionId) {
        toast.success("User is successfully created!");
        setOpen(false);
        setDomainData(null);
        setUserDataList(null);
      }
    } catch (err) {
      toast.error(`${err} has occurred, please try again!`);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getData = async () => {
      const response = await getPackagesList();
      const tempIds = Object.keys(response);
      setBusinessId(tempIds[0]);
      setEnterpriseId(tempIds[1]);
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
          Add User
        </Typography>
        <form
          onSubmit={createUserFormSubmitHandler}
          className={classes["create-modal-form"]}
        >
          <div className={classes.split}>
            <div className={classes.inputs}>
              <label htmlFor="name">Full Name</label>
              <TextField
                id="name"
                name="name"
                placeholder="Enter Full Name"
                label=""
                variant="outlined"
                onBlur={setUserDataHandler}
              />
              <label htmlFor="phoneNumber">Phone Number</label>
              <PhoneInput
                placeholder="Enter Phone Number"
                id="phoneNumber"
                value={userData.phoneNumber}
                defaultCountry="PK"
                countryCallingCodeEditable={false}
                international
                withCountryCallingCode={true}
                onChange={(value) =>
                  setUserData((prevState) => ({
                    ...prevState,
                    phoneNumber: value,
                  }))
                }
              />

              {/* <TextField
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                label=""
                variant="outlined"
                onBlur={setUserDataHandler}
              /> */}
              <label htmlFor="domain">Domain</label>
              <TextField
                id="domain"
                name="domain"
                placeholder="Enter Domain"
                label=""
                variant="outlined"
                onBlur={setUserDataHandler}
              />
              <label htmlFor="emailPackage">Package</label>
              <Select
                onChange={setUserDataHandler}
                id="emailPackage"
                label="Package Name"
                name="emailPackage"
              >
                <MenuItem name="emailPackage" value={businessId}>
                  Business Email
                </MenuItem>
                <MenuItem name="emailPackage" value={enterpriseId}>
                  Enterprise Email
                </MenuItem>
              </Select>
              <label htmlFor="cycle">Choose Cycle</label>
              <div className={classes.radio}>
                <input
                  onClick={setUserDataHandler}
                  type="radio"
                  id="monthly"
                  name="planDuration"
                  value="month"
                />
                <label for="monthly">Monthly</label>
                <br />
                <input
                  onClick={setUserDataHandler}
                  type="radio"
                  id="yearly"
                  name="planDuration"
                  value="year"
                />
                <label for="yearly">Yearly</label>
              </div>
            </div>
            <div className={classes.inputs}>
              <label htmlFor="email">Email</label>
              <TextField
                id="email"
                name="email"
                placeholder="Enter Email Address"
                label=""
                variant="outlined"
                onBlur={setUserDataHandler}
              />
              <label htmlFor="company">Company Name</label>
              <TextField
                id="company"
                name="company"
                placeholder="Enter Phone Number"
                label=""
                variant="outlined"
                onBlur={setUserDataHandler}
              />
              <label htmlFor="emailNo">No. of Email</label>
              <TextField
                id="emailNo"
                name="emailNo"
                placeholder="No. of Email"
                label=""
                type="number"
                inputProps={{ min: 1 }}
                variant="outlined"
                onBlur={setUserDataHandler}
              />
              <label htmlFor="password">Password</label>
              <TextField
                id="password"
                name="password"
                label=""
                type="password"
                variant="outlined"
                onChange={setUserDataHandler}
              />
              <br />
              <br />

              <input
                style={{ margin: "0 10px 0 0", display: "inline" }}
                onChange={(event) =>
                  setUserData((prevState) => ({
                    ...prevState,
                    firstBillingFree: event.target.checked,
                  }))
                }
                checked={userData.firstBillingFree}
                type="checkbox"
                name="firstBillingFree"
                id="firstBillingFree"
              />
              <label style={{ display: "inline" }} htmlFor="firstBillingFree">
                Free / Manual Billing
              </label>
            </div>
          </div>
          <div className={classes["submit-buttons"]}>
            <button disabled={loading} type="submit" className="color-button">
              {loading ? "Please Wait..." : "Add"}
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

export default AddUserModal;
