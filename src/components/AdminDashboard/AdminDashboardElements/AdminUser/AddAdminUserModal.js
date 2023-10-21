import React, { Fragment, useEffect, useState } from "react";
import { Box, Modal, TextField, Typography } from "@mui/material";

import classes from "./AddAdminUserModal.module.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddAdminUserModal = ({ open, setOpen, refreshData }) => {
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [accesslevel, setAccessLevel] = useState({
    superAdmin: false,
    accountReadOnly: false,
    accountFullAccess: false,
    supportReadOnly: false,
    supportFullAccess: false,
  });
  const [userData, setUserData] = useState({ isDisabled: false });

  const setAccessLevelCheckboxHandler = (event) => {
    if (event.target.name === "superAdmin") {
      setAccessLevel((prevState) => ({
        ...prevState,
        superAdmin: event.target.checked,
      }));
    }

    if (event.target.name === "account" && !event.target.checked) {
      setAccessLevel((prevState) => ({
        ...prevState,
        accountReadOnly: false,
        accountFullAccess: false,
      }));
      console.log("Set account false");
    }

    if (event.target.name === "support" && !event.target.checked) {
      setAccessLevel((prevState) => ({
        ...prevState,
        supportReadOnly: false,
        supportFullAccess: false,
      }));
      console.log("Set support False");
    }
  };

  const setAccessLevelRadioHandler = (event) => {
    if (event.target.name === "account") {
      setAccessLevel((prevState) => ({
        ...prevState,
        accountReadOnly: false,
        accountFullAccess: false,
        [event.target.value]: true,
      }));
    }
    if (event.target.name === "support") {
      setAccessLevel((prevState) => ({
        ...prevState,
        supportReadOnly: false,
        supportFullAccess: false,
        [event.target.value]: true,
      }));
    }
  };

  const setUserDataHandler = (event) => {
    setUserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const addUserFormSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75"
    );
    myHeaders.append("uuid", auth.id);

    const formData = new FormData();

    formData.append("email", userData.email);
    formData.append("phone", userData.phoneNumber);
    formData.append("name", userData.name);
    formData.append("password", userData.password);
    formData.append("position", userData.position);
    formData.append("superAdmin", accesslevel.superAdmin);
    formData.append("accountsRead", accesslevel.accountReadOnly);
    formData.append("accountsFull", accesslevel.accountFullAccess);
    formData.append("supportRead", accesslevel.supportReadOnly);
    formData.append("supportFull", accesslevel.supportFullAccess);
    if (open !== "add") {
      formData.append("isdisabled", userData.isDisabled);
      console.log(userData.isDisabled);
      formData.append("uuid", open.profile.uid);
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    if (open === "add") {
      const response = await fetch(
        "https://api.inspedium.email/admin/create-user",
        requestOptions
      );
      const responseData = await response.json();

      if (response.ok) {
        toast.success(
          `${userData.name} has been added with the User ID: ${responseData.user_id}`
        );
        setOpen(false);
        setTimeout(() => {
          refreshData();
        }, 1000);
      } else {
        toast.error(responseData.detail);
      }
    } else {
      const response = await fetch(
        "https://api.inspedium.email/admin/edit-adminUser",
        requestOptions
      );
      const responseData = await response.json();

      if (response.ok) {
        toast.success("User edited successfully!");
        setOpen(false);
        setTimeout(() => {
          refreshData();
        }, 1000);
      } else {
        toast.error(responseData.detail);
      }
    }
    setLoading(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "DM Sans",
    width: "700px",
    maxWidth: "90%",
    // p: 0,
    // border: "2px solid #000",
  };

  useEffect(() => {
    if (open !== "add") {
      setAccessLevel({
        superAdmin: open.fullaccess,
        accountReadOnly: open["packages-read"],
        accountFullAccess: open["packages-write"],
        supportReadOnly: open["users-read"],
        supportFullAccess: open["users-write"],
      });
      setUserData({
        name: open.profile.name,
        email: open.profile.email,
        phoneNumber: open.profile.phone,
        position: open.profile.position,
        isDisabled: false,
        password: "",
      });
    }
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
          {open === "add" ? "Add" : "Edit"} Admin User
        </Typography>
        <form
          onSubmit={addUserFormSubmitHandler}
          className={classes["create-modal-form"]}
        >
          <div className={classes.split}>
            <div className={classes.inputs}>
              <label htmlFor="name"> Name</label>
              <TextField
                id="name"
                name="name"
                placeholder="Enter Name"
                label=""
                variant="outlined"
                onChange={setUserDataHandler}
                value={userData.name}
              />

              <label htmlFor="cycle"> Access Level</label>
              <div className={classes.radio}>
                <input
                  type="checkbox"
                  id="superAdmin"
                  name="superAdmin"
                  value="superAdmin"
                  checked={accesslevel.superAdmin}
                  onClick={setAccessLevelCheckboxHandler}
                  // checked={accesslevel === "superAdmin"}
                />
                <label for="superAdmin"> Super Admin</label>
                <br />
                <input
                  type="checkbox"
                  id="account"
                  name="account"
                  value="readAccessAccount"
                  onClick={setAccessLevelCheckboxHandler}
                  // onClick={setAccessLevelHandler}
                  // checked={accesslevel === "readAccessAccount"}
                />
                <label for="account"> Account</label>
                <br />
                <input
                  type="radio"
                  name="account"
                  value="accountReadOnly"
                  id="accountReadOnly"
                  checked={accesslevel.accountReadOnly}
                  onClick={setAccessLevelRadioHandler}
                />
                <label for="accountReadOnly"> Read Only Access</label>
                <br />
                <input
                  type="radio"
                  name="account"
                  id="accountFullAccess"
                  value="accountFullAccess"
                  checked={accesslevel.accountFullAccess}
                  onClick={setAccessLevelRadioHandler}
                  // disabled={
                  //   !(
                  //     accesslevel === "readAccessAccount" ||
                  //     accesslevel === "fullAccessAccount"
                  //   )
                  // }
                />
                <label for="accountFullAccess"> Full Access</label>
                <br />
                <input
                  type="checkbox"
                  id="support"
                  name="support"
                  value="support"
                  onClick={setAccessLevelCheckboxHandler}
                  // onClick={setAccessLevelHandler}
                  // checked={accesslevel === "support"}
                />
                <label for="support"> Support</label>
                <br />
                <input
                  type="radio"
                  id="supportReadOnly"
                  name="support"
                  value="supportReadOnly"
                  onClick={setAccessLevelRadioHandler}
                  checked={accesslevel.supportReadOnly}
                  // disabled={accesslevel !== "support"}
                  // onClick={setAccessLevelHandler}
                />
                <label for="supportReadOnly"> Read Only Access</label>
                <br />
                <input
                  type="radio"
                  id="supportFullAccess"
                  name="support"
                  value="supportFullAccess"
                  onClick={setAccessLevelRadioHandler}
                  checked={accesslevel.supportFullAccess}
                  // disabled={accesslevel !== "support"}
                  // onClick={setAccessLevelHandler}
                />
                <label for="supportFullAccess"> Full Access</label>
                {open !== "add" && (
                  <Fragment>
                    <br />
                    <input
                      type="checkbox"
                      name="isDisabled"
                      id="isDisabled"
                      value="isDisabled"
                      checked={userData.isDisabled}
                      onClick={(event) =>
                        setUserData((prevState) => ({
                          ...prevState,
                          isDisabled: event.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="isDisabled"> Is Disabled</label>
                  </Fragment>
                )}
              </div>
              <label htmlFor="password">
                {open === "add" ? "Password" : "Set New Password"}
              </label>
              <TextField
                id="password"
                name="password"
                type="password"
                label=""
                variant="outlined"
                onChange={setUserDataHandler}
              />
            </div>
            <div className={classes.inputs}>
              <label htmlFor="email">Email</label>
              <TextField
                id="email"
                name="email"
                placeholder="Enter Email Address"
                label=""
                variant="outlined"
                onChange={setUserDataHandler}
                value={userData.email}
              />
              <label htmlFor="phoneNumber">Phone Number</label>
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                value={userData.phoneNumber}
                placeholder="Enter Phone Number"
                label=""
                variant="outlined"
                onChange={setUserDataHandler}
              />
              <label htmlFor="position">Position</label>
              <TextField
                id="position"
                name="position"
                placeholder="Enter Position"
                label=""
                variant="outlined"
                value={userData.position}
                onChange={setUserDataHandler}
              />
            </div>
          </div>
          <div className={classes["submit-buttons"]}>
            <button disabled={loading} type="submit" className="color-button">
              {loading ? "Loading..." : "Confirm"}
            </button>
            <button
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

export default AddAdminUserModal;
