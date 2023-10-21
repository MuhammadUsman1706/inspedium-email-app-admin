import React, { useState } from "react";
import { logInAdmin } from "../../redux/auth-actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { withStyles } from "@mui/styles";
import loginLogo from "../../assets/images/logo-login.png";

import classes from "./Auth.module.css";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "yellow",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#bababa",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
})(TextField);

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  });

  const setAdminDataHandler = (event) => {
    setAdminData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const logAdminInHandler = async (event) => {
    event.preventDefault();
    const response = await dispatch(
      logInAdmin(adminData.email, adminData.password)
    );
    if (response) navigate("/admin-dashboard");
  };

  return (
    <main className={classes.auth}>
      <section className={classes.login}>
        <header className={classes["login-logo"]}>
          <img src={loginLogo} alt="Inspedium Email" />
          <h1>Log In</h1>
        </header>

        <form onSubmit={logAdminInHandler} className={classes["login-form"]}>
          <label htmlFor="email">Email Address</label>
          <CssTextField
            id="email"
            name="email"
            placeholder="Enter Email Address"
            variant="outlined"
            onChange={setAdminDataHandler}
            value={adminData.email}
          />
          <br />
          <label htmlFor="password">Password</label>
          <CssTextField
            id="password"
            name="password"
            variant="outlined"
            placeholder="Enter Password"
            onChange={setAdminDataHandler}
            type="password"
          />
          <Button
            sx={{ margin: "auto" }}
            onClick={logAdminInHandler}
            variant="contained"
            type="submit"
          >
            Log In
          </Button>
        </form>
      </section>
    </main>
  );
};

export default Auth;
