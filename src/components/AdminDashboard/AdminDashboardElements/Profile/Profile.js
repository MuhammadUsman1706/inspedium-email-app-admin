import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import {
  setUserDetails,
  setUserPassword,
} from "../../../../redux/auth-actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "react-phone-number-input/style.css";

import classes from "./Profile.module.css";

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [password, setPassword] = useState({});
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    reTypePassword: false,
  });

  const setUserInfoHandler = (event) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const setUserPasswordHandler = (event) => {
    setPassword((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  };

  const setShowPasswordHandler = (event) => {
    const targetId = event.currentTarget.id;
    setShowPassword((prevState) => ({
      ...prevState,
      [targetId]: !prevState[targetId],
    }));
  };

  const changeUserInfoFormHandler = async (event) => {
    event.preventDefault();
    if (userInfo.phone && !isPossiblePhoneNumber(userInfo.phone)) {
      toast.error("Please enter a valid phone number!");
      return;
    }
    setLoading(true);
    await dispatch(setUserDetails(auth.id, userInfo));
    setLoading(false);
  };

  const changeUserPasswordHandler = async (event) => {
    setLoading(true);
    event.preventDefault();
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/;
    if (password.newPassword !== password.reTypePassword) {
      toast.error("Password fields are not same!");
    } else if (!regex.test(password.newPassword)) {
      toast.error(
        "Password must be of 12 characters, must contain a lower and uppercase character and must have a special character!"
      );
    } else {
      await dispatch(
        setUserPassword(auth.email, password.oldPassword, password.newPassword)
      );
    }
    setLoading(false);
  };

  return (
    <div className={classes.profile}>
      <form onSubmit={changeUserInfoFormHandler} className={classes.info}>
        <h3>Info</h3>
        <hr />
        <div className={classes["info-form"]}>
          <div>
            <label htmlFor="name">User Name</label>
            <TextField
              placeholder="john.smith"
              id="name"
              // label="userName"
              variant="outlined"
              defaultValue={auth.name}
              onChange={setUserInfoHandler}
            />

            <label htmlFor="phone">Phone</label>
            <PhoneInput
              placeholder="Enter phone number"
              value={userInfo?.phone ? userInfo?.phone : auth.phone}
              defaultCountry="PK"
              countryCallingCodeEditable={false}
              international
              withCountryCallingCode={true}
              onChange={(value) =>
                setUserInfo((prevState) => ({ ...prevState, phone: value }))
              }
            />
            {/* <TextField
              placeholder="Phone Number"
              id="phone"
              // label="userName"
              variant="outlined"
              defaultValue={auth.phone}
              onChange={setUserInfoHandler}
            /> */}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <TextField
              placeholder="Email"
              id="email"
              // label="userName"
              variant="outlined"
              defaultValue={auth.email}
              disabled
            />
            <label htmlFor="position">Position</label>
            <TextField
              placeholder="Position"
              id="position"
              // label="userName"
              variant="outlined"
              defaultValue={auth.position}
              onChange={setUserInfoHandler}
            />
          </div>
        </div>
        <button disabled={loading} type="submit" className="color-button">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
      <form onSubmit={changeUserPasswordHandler} className={classes.password}>
        <h3>Change Password</h3>
        <hr />
        <label htmlFor="oldPassword">Old Password</label>
        <OutlinedInput
          //   placeholder="oldPassword"
          type={showPassword.oldPassword ? "text" : "password"}
          id="oldPassword"
          onChange={setUserPasswordHandler}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                id="oldPassword"
                onClick={setShowPasswordHandler}
              >
                {showPassword.oldPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          variant="outlined"
        />
        <label htmlFor="newPassword">New Password</label>
        <OutlinedInput
          type={showPassword.newPassword ? "text" : "password"}
          id="newPassword"
          variant="outlined"
          onChange={setUserPasswordHandler}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                id="newPassword"
                onClick={setShowPasswordHandler}
              >
                {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <label htmlFor="reTypePassword">Re-Type Password</label>
        <OutlinedInput
          type={showPassword.reTypePassword ? "text" : "password"}
          id="reTypePassword"
          onChange={setUserPasswordHandler}
          variant="outlined"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                id="reTypePassword"
                onClick={setShowPasswordHandler}
              >
                {showPassword.reTypePassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
        <button type="submit" disabled={loading} className="color-button">
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
