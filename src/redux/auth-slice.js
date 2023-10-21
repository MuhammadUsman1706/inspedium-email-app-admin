import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  email: "",
  phone: "",
  position: "",
  isLoggedIn: false,
  // company: "",
  // stripe_id: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action) {
      const actionKeys = Object.keys(action.payload);
      actionKeys.forEach((key) => (state[key] = action.payload[key]));
      state.isLoggedIn = true;
    },
    logUserOut() {
      return initialState;
    },
  },
});

export const authSliceActions = authSlice.actions;
export default authSlice.reducer;
