import React, { Fragment, useEffect } from "react";
import Auth from "./components/Auth/Auth";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import IdleTimer from "./IdleTimer";
import { logInAdmin, logOutUser } from "./redux/auth-actions";
import { getPackagesList } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const auth = getAuth();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      var timer = new IdleTimer({
        timeout: 900,
        onTimeout: () => {
          dispatch(logOutUser());
          // console.log("LOGOUT");
          navigate("/");
        },
        onExpired: async () => {
          dispatch(logOutUser());
          // console.log("EXPIRED");
          navigate("/");
        },
      });
    }

    if (user && !isLoggedIn) {
      const userId = localStorage.getItem("uid");
      const userEmail = localStorage.getItem("userEmail");
      if (userId) {
        dispatch(logInAdmin(userEmail, null, userId));
      }
    }

    return () => {
      timer.cleanUp();
    };
  });

  useEffect(() => {
    const getData = async () => {
      const response = await getPackagesList();
      const tempIds = Object.keys(response);
      localStorage.setItem("businessId", tempIds[0]);
      localStorage.setItem("enterpriseId", tempIds[1]);
    };

    getData();
  }, []);

  return (
    <Fragment>
      <ToastContainer />
      <Routes>
        <Route element={<Auth />} path="/" />
        {isLoggedIn && (
          <Route element={<AdminDashboard />} path="/admin-dashboard" />
        )}
      </Routes>
    </Fragment>
  );
}

export default App;
