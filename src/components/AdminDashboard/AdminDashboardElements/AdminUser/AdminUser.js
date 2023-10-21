import React, { useState, useEffect, Fragment } from "react";
import AddAdminUser from "./AddAdminUserModal";
import { getAdminUsersList } from "../../../../firebase";
import { useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import classes from "./AdminUser.module.css";

let adminListCopy;

const AdminUser = ({ adminUsersData, setAdminUsersData }) => {
  const auth = useSelector((state) => state.auth);
  const [searchParam, setSearchParam] = useState("");
  const [addAdminUser, setAddAdminUser] = useState(false);

  const deleteAdminUserHandler = (userId) => {
    const headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Authorization", "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75");
    headers.append("uuid", auth.id);
    const body = new FormData();
    body.append("userId", userId);

    const requestOptions = {
      method: "POST",
      headers,
      body,
    };
    confirmAlert({
      title: "Warning!",
      message: "Are you sure you want to delete this admin?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const response = await fetch(
              "https://api.inspedium.email/admin/remove-adminUser",
              requestOptions
            );
            const responseData = await response.json();
            if (responseData?.user_id) {
              toast.success(`${responseData.user_id} successfully removed!`);
              const filteredAdminData = adminUsersData.filter(
                (user) => user.profile.uid !== userId
              );
              setAdminUsersData(filteredAdminData);
              adminListCopy = filteredAdminData;
            } else {
              toast.error("An error occurred, please try later!");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const loadData = async () => {
    const response = await getAdminUsersList();
    adminListCopy = response;
    setAdminUsersData(response);
  };

  useEffect(() => {
    if (!adminUsersData) {
      loadData();
    }
  }, []);

  useEffect(() => {
    if (adminUsersData && adminListCopy) {
      const filteredDomains = adminListCopy.filter((user) =>
        user.profile.email.toLowerCase().includes(searchParam)
      );
      setAdminUsersData(filteredDomains);
    }
  }, [searchParam]);

  return (
    <div className={classes.domain}>
      <div className={classes["top-bar"]}>
        <Paper
          component="form"
          onSubmit={(event) => event.preventDefault()}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Admin Users"
            disabled={!adminUsersData}
            onBlur={(event) => setSearchParam(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearchParam(event.target.value);
              }
            }}
            inputProps={{ "aria-label": "search google maps" }}
          />
        </Paper>
        <button
          onClick={() => setAddAdminUser("add")}
          className={classes["color-button"]}
        >
          Add User
        </button>
      </div>
      <div className={classes["domain-table"]}>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Access Level</th>
              <th>Name</th>
              <th>Position</th>
              <th> </th>
              <th> </th>
              <th> </th>
            </tr>
          </thead>

          <tbody>
            {adminUsersData ? (
              adminUsersData.map((user) => (
                <tr key={user.profile.email}>
                  <td>
                    <span className={classes["table-text"]}>
                      {user.profile.email}
                    </span>
                  </td>
                  <td>
                    <span className={classes["table-text"]}>
                      {user.fullaccess && "SuperAdmin"}
                      {!user.fullaccess &&
                        (user["packages-write"]
                          ? "Account"
                          : user["packages-read"] && "Account-Limited")}
                      &nbsp;
                      {!user.fullaccess &&
                        (user["users-write"]
                          ? "Support"
                          : user["users-read"] && "Support-Limited")}
                    </span>
                  </td>
                  <td>
                    <span className={classes["table-text"]}>
                      {user.profile.name}
                    </span>
                  </td>
                  <td>
                    <span className={classes["table-text"]}>
                      {user.profile.position}
                    </span>
                  </td>
                  <td onClick={() => setAddAdminUser(user)}>
                    <span className={classes.setting}>
                      <EditIcon />
                    </span>
                  </td>
                  <td>
                    <span className={classes.setting}>
                      <DeleteIcon
                        onClick={() => {
                          deleteAdminUserHandler(user.profile.uid);
                        }}
                      />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <Fragment>
                {[...Array(3)].map((x, i) => (
                  <tr>
                    <th>
                      <Skeleton />
                    </th>
                    <th>
                      <Skeleton />
                    </th>
                    <th>
                      <span className={classes["table-text"]}>
                        <Skeleton />
                      </span>
                    </th>
                    <th>
                      <span className={classes.setting}>
                        <Skeleton />
                      </span>
                    </th>
                  </tr>
                ))}
              </Fragment>
            )}
          </tbody>
        </table>
      </div>
      {addAdminUser && (
        <AddAdminUser
          open={addAdminUser}
          setOpen={setAddAdminUser}
          refreshData={loadData}
        />
      )}

      {/* {viewDetailsModal && (
        <ViewDetailsModal
          open={viewDetailsModal}
          setOpen={setViewDetailsModal}
          //   adminUsersData={adminUsersData}
          //   setRefreshPage={setRefreshPage}
        />
      )} */}
    </div>
  );
};

export default AdminUser;
