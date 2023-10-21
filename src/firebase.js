import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, update } from "firebase/database";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJzZ5hh2Ae4dy3b_zHFtk45bHOcWFL3vQ",
  authDomain: "inspedium-email.firebaseapp.com",
  databaseURL: "https://inspedium-email-default-rtdb.firebaseio.com",
  projectId: "inspedium-email",
  storageBucket: "inspedium-email.appspot.com",
  messagingSenderId: "167880186470",
  appId: "1:167880186470:web:235b8306258c03811d6ba7",
  measurementId: "G-Z941CKX41F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// Database Functions
export const getPackagesList = async () => {
  const dbRef = ref(database);
  const response = await get(child(dbRef, "packages"));
  if (response.exists()) {
    return response.val();
  } else {
    console.log("No data available");
  }
};

// FIX
export const getUserDetails = async (userId) => {
  const dbRef = ref(database);
  const response = await get(child(dbRef, `admin/users/${userId}/`));
  if (response.exists()) {
    return response.val();
  } else {
    console.log("No data available");
  }
};

export const getUserProfile = async (userId) => {
  const dbRef = ref(database);
  const response = await get(child(dbRef, `users/${userId}/profile`));
  if (response.exists()) {
    return response.val();
  } else {
    console.log("No data available");
  }
};

export const getAdminUsersList = async () => {
  const dbRef = ref(database);
  const response = await get(child(dbRef, `admin/users`));
  if (response.exists()) {
    return Object.values(response.val());
  } else {
    console.log("No data available");
  }
};

export const changeUserDetails = async (userId, details) => {
  const dbRef = ref(database, `admin/users/${userId}/profile/`);
  const response = await update(dbRef, details);
  if (details.name) {
    updateProfile(auth.currentUser, {
      displayName: details.name,
    });
  }
};

// export const getDomainInformation = async (userId, domain) => {
//   const dbRef = ref(database);
//   const response = await get(
//     child(dbRef, `users/${userId}/domain/${domain}/purchases`)
//   );
//   if (response.exists()) {
//     return response.val();
//   } else {
//     console.log("No data available");
//   }
// };

// Auth Functions
export const signInUser = async (useremail, password) => {
  const response = await signInWithEmailAndPassword(auth, useremail, password);
  return response;
};

export const changeUserPassword = async (
  email,
  currentPassword,
  newPassword
) => {
  const credential = EmailAuthProvider.credential(email, currentPassword);
  const response = await reauthenticateWithCredential(
    auth.currentUser,
    credential
  );
  await updatePassword(auth.currentUser, newPassword);
};

export const logoutUser = () => {
  signOut(auth).then((result) => console.log(result));
};
