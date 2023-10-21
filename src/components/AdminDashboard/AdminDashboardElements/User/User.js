import React, { Fragment, useState, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Skeleton } from "@mui/material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import maskImage from "../../../../assets/images/mask.jpg";

import classes from "./User.module.css";

let requestOptions;
let userListCopy;

const User = ({
  currentItems,
  userDataList,
  setUserDataList,
  setDomainData,
  searchParam,
  setSearchParam,
}) => {
  const auth = useSelector((state) => state.auth);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const secretPath = "8gjrnvqZUIn3Fhcy42ELenQHZ6zU7lKO3g5EY3ehJ9NHzuTY";

  const setUserStatusHandler = (uuid, status) => {
    confirmAlert({
      title: "Confirm Status Change",
      message: "Are you sure you want to alter the status of this user?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const formData = new FormData();
            formData.append("uuid", uuid);
            formData.append("isdisabled", !status);
            requestOptions.method = "POST";
            requestOptions.body = formData;

            const response = await fetch(
              "https://api.inspedium.email/admin/editClientUserStatus",
              requestOptions
            );
            const responseData = await response.json();
            if (responseData.user) {
              toast.success("Status changed successfully!");

              if (searchParam) {
                const indexCopyList = userListCopy.findIndex(
                  (user) => user.uuid === uuid
                );
                userListCopy[indexCopyList].status = status;
              } else {
                const indexUserList = userDataList.findIndex(
                  (user) => user.uuid === uuid
                );
                // const alteredStatusList = userDataList;
                userListCopy[indexUserList].status = status;
                // alteredStatusList[indexUserList].status = status;
                setUserDataList(userListCopy);
              }
            } else {
              toast.error("Some error occurred, please try again!");
              document.getElementById(uuid).checked = !status;
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            document.getElementById(uuid).checked = !status;
          },
        },
      ],
    });
  };

  const deleteUserHandler = (uuid) => {
    confirmAlert({
      title: "Delete User",
      message: "Are you sure you want to DELETE this user?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const formData = new FormData();
            formData.append("uuid", uuid);
            requestOptions.method = "POST";
            requestOptions.body = formData;

            const response = await fetch(
              "https://api.inspedium.email/admin/removeClientUser",
              requestOptions
            );
            const responseData = await response.json();
            if (responseData.user) {
              toast.success("User deleted successfully!");
              setDomainData(null);
              // setUserDataList(null);
              if (searchParam) {
                userListCopy = userListCopy.filter(
                  (user) => user.uuid !== uuid
                );
                const filteredUsers = userDataList.filter(
                  (user) => user.uuid !== uuid
                );
                setUserDataList(filteredUsers);
              } else {
                const filteredUsers = userDataList.filter(
                  (user) => user.uuid !== uuid
                );
                setUserDataList(filteredUsers);
                userListCopy = filteredUsers;
              }
            } else {
              toast.error("Some error occurred, please try again!");
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
            placeholder="Search Users"
            disabled={!userDataList}
            onBlur={(event) => setSearchParam(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearchParam(event.target.value);
              }
            }}
            inputProps={{ "aria-label": "search google maps" }}
          />
        </Paper>

        {(auth.supportWrite || auth.fullAccess) && (
          <button
            onClick={() => setOpenCreateModal(true)}
            className={classes["color-button"]}
          >
            Add User
          </button>
        )}
      </div>
      <div className={classes["domain-table"]}>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Phone No.</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Login As a User</th>
              {auth.fullAccess && <th></th>}
            </tr>
          </thead>
          <tbody>
            {currentItems ? (
              currentItems.map((user) => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>
                    {user.last_login
                      ? new Date(+user.last_login).toLocaleString("en-GB")
                      : "Not Logged In"}
                  </td>
                  <td>
                    <label class={classes.switch}>
                      <input
                        type="checkbox"
                        id={user.uuid}
                        defaultChecked={user.status}
                        onChange={(event) =>
                          setUserStatusHandler(user.uuid, event.target.checked)
                        }
                      />
                      <span class={`${classes.slider} ${classes.round}`}></span>
                    </label>
                  </td>
                  <td>
                    <a
                      target="_blank"
                      href={`https://inspedium.email/${secretPath}/${user.uuid}`}
                      // href={`http://localhost:3000/${secretPath}/${user.uuid}`}
                    >
                      <img src={maskImage} alt="" />
                    </a>
                  </td>
                  {auth.fullAccess && (
                    <td>
                      <span className={classes.setting}>
                        <DeleteIcon
                          onClick={() => deleteUserHandler(user.uuid)}
                        />
                      </span>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <Fragment>
                {[...Array(3)].map((x, i) => (
                  <tr key={i}>
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
                    <th>
                      <span className={classes.setting}>
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
      <AddUserModal
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        setDomainData={setDomainData}
        setUserDataList={setUserDataList}
      />
    </div>
  );
};

function PaginatedUsers({
  itemsPerPage,
  userDataList,
  setUserDataList,
  setDomainData,
}) {
  const auth = useSelector((state) => state.auth);
  const [searchParam, setSearchParam] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = userDataList?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(userDataList?.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % userDataList.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if (!userDataList) {
      var myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75"
      );
      myHeaders.append("uuid", auth.id);

      requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`https://api.inspedium.email/admin/users-list`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setUserDataList(result.user_list);
          userListCopy = result.user_list;
          setSearchParam("");
        })
        .catch((error) => console.log("error", error));
    }
  }, [userDataList]);

  useEffect(() => {
    if (userDataList && userListCopy) {
      const filteredDomains = userListCopy.filter((user) =>
        user.email.toLowerCase().includes(searchParam)
      );

      setUserDataList(filteredDomains);
    }
  }, [searchParam]);

  return (
    <Fragment>
      <User
        currentItems={currentItems}
        userDataList={userDataList}
        setUserDataList={setUserDataList}
        setDomainData={setDomainData}
        setSearchParam={setSearchParam}
        searchParam={searchParam}
      />
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        className="pagination-list"
      />
    </Fragment>
  );
}

export default PaginatedUsers;
