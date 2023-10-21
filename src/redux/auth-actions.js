import {
  getUserDetails,
  signInUser,
  logoutUser,
  changeUserDetails,
  changeUserPassword,
} from "../firebase";
import { authSliceActions } from "./auth-slice";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

export const logInAdmin = (useremail, password, uid = null) => {
  return async (dispatch) => {
    try {
      // const cookies = new Cookies();
      const auth = getAuth();

      if (password) {
        var userData = await signInUser(useremail, password);
        localStorage.setItem("uid", userData?.user?.uid);
        localStorage.setItem("userEmail", useremail);
      }

      const adminConfirmationData = userData
        ? await userData.user.getIdTokenResult()
        : await auth.currentUser.getIdTokenResult();

      if (adminConfirmationData.claims.isAdmin) {
        const userDetails = await getUserDetails(userData?.user?.uid || uid);

        dispatch(
          authSliceActions.setUserData({
            id: userData?.user?.uid || uid,
            fullAccess: userDetails.fullaccess,
            accountRead: userDetails["packages-read"],
            accountWrite: userDetails["packages-write"],
            supportRead: userDetails["users-read"],
            supportWrite: userDetails["users-write"],
            ...userDetails.profile,
          })
        );

        toast.success(`Welcome, ${userDetails.profile.name}`);

        return true;
      } else {
        toast.error("The application is down right now. Please try later.");
      }
    } catch (err) {
      toast.error("The application is down right now. Please try later.");
      return false;
    }
  };
};

export const logOutUser = () => {
  return async (dispatch) => {
    await logoutUser();
    localStorage.removeItem("uid");
    localStorage.removeItem("userEmail");
    dispatch(authSliceActions.logUserOut());
  };
};

export const setUserDetails = (userId, details) => {
  return async (dispatch) => {
    if (Object.keys(details).length > 0) {
      dispatch(authSliceActions.setUserData(details));
      changeUserDetails(userId, details);
      toast.success("Information updated successfully!");
    } else {
      toast.info("No changes to make.");
    }
  };
};

export const setUserPassword = (email, currentPassword, newPassword) => {
  return async () => {
    try {
      await changeUserPassword(email, currentPassword, newPassword);
      toast.success("Password changed successfully!");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        toast.error("The current password is incorrect!");
      } else {
        toast.error("An unknown error has occurred, please try later.");
      }
    }
  };
};
