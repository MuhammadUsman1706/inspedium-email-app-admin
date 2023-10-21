import React, { Fragment, useState, useEffect } from "react";
import AddDomainModal from "./DomainElements/AddDomainModal";
import UpgradeDomainModal from "./DomainElements/UpgradeDomainModal";
import DowngradeDomainModal from "./DomainElements/DowngradeDomainModal";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import DowngradeIcon from "@mui/icons-material/TrendingDown";
import DeleteIcon from "@mui/icons-material/Delete";
import UpgradeIcon from "@mui/icons-material/TrendingUp";

import classes from "./Domain.module.css";
import "react-confirm-alert/src/react-confirm-alert.css";

let requestOptions;
let domainCopy;
let responseCount = 0;

const Domain = ({
  userDataList,
  domainData,
  setDomainData,
  currentItems,
  setSearchParam,
  setSearchType,
}) => {
  const auth = useSelector((state) => state.auth);
  const [openDowngradeModal, setOpenDowngradeModal] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [addDomainModal, setAddDomainModal] = useState(false);

  const changeDomainStatusHandler = (event, domainId, uuid) => {
    let responseWait;
    var headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Authorization", "Bearer 28gYwtmko2V1TA2S3JnIqB2gUnKnrg75");
    headers.append("uuid", uuid);

    const formData = new FormData();
    formData.append("domainstatus", event.target.checked);
    requestOptions.method = "POST";
    requestOptions.headers = headers;
    requestOptions.body = formData;

    const getResponse = async () => {
      const response = await fetch(
        `https://api.inspedium.email/domain-setting?domain=${domainId}`,
        requestOptions
      );

      const responseData = await response.json();

      toast.info(responseData.info.msg);

      const index = domainData.findIndex(
        (domain) => domain.domain === domainId
      );
      const updatedDomain = domainData;
      updatedDomain[index].status = event.target.checked;
      setDomainData(updatedDomain);
    };

    if (responseCount > 0) {
      clearTimeout(responseWait);
      responseWait = setTimeout(() => getResponse(), 3000);
    } else {
      getResponse();
      responseCount++;
    }
  };

  const deleteDomainHandler = (
    domainName,
    subscriptionId,
    productName,
    uuid
  ) => {
    const businessId = localStorage.getItem("businessId");
    const enterpriseId = localStorage.getItem("enterpriseId");
    requestOptions.method = "POST";
    requestOptions.body = JSON.stringify({
      domain: domainName,
      subscriptionId,
      plan_id: productName === "Business Emails" ? businessId : enterpriseId,
      customer_uuid: uuid,
    });
    confirmAlert({
      title: "Warning!",
      message:
        "Are you sure you want to delete this domain? Please keep in mind that all related data, such as mailboxes, email aliases, etc. will be erased! This action is irrevesible!",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const response = await fetch(
              "https://api.inspedium.email/cancel-subscription?isAdmin=true",
              requestOptions
            );
            const responseData = await response.json();
            if (responseData?.domain?.returncode === 1) {
              toast.success(responseData.domain?.returndata);
              const filteredDomainData = domainData.filter(
                (domain) => domain.domain !== domainName
              );
              setDomainData(filteredDomainData);
              localStorage.setItem("lastDomainName", "");
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

  return (
    <div className={classes.domain}>
      <div className={classes["top-bar"]}>
        <div className={classes["search-bar"]}>
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
              placeholder="Search Domain"
              disabled={!domainData}
              onBlur={(event) => setSearchParam(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setSearchParam(event.target.value);
                }
              }}
              inputProps={{ "aria-label": "search google maps" }}
            />
          </Paper>

          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="searchType">Search By</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="searchType"
              label="Search By"
              onChange={(event) => setSearchType(event.target.value)}
              defaultValue="domain"
              // sx={{ color: "#7D6AD1" }}
            >
              <MenuItem value="domain">Search By Domain Name</MenuItem>
              <MenuItem value="userID">Search By User Id</MenuItem>
            </Select>
          </FormControl>
        </div>
        {(auth.supportWrite || auth.fullAccess) && (
          <button
            onClick={() => setAddDomainModal(true)}
            className={classes["color-button"]}
          >
            Add Domain
          </button>
        )}
      </div>
      <div className={classes["domain-table"]}>
        <table>
          <thead>
            <tr>
              <th>Domain Name</th>
              <th>User ID</th>
              <th>Type</th>
              <th>No of Mailbox</th>
              <th>Status</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems ? (
              currentItems.map((domain, index) => (
                <tr key={index}>
                  <td>
                    <span className={classes["table-text"]}>
                      {domain.domain}
                    </span>
                  </td>
                  <td>
                    <span className={classes["table-text"]}>
                      {domain.userID}
                    </span>
                  </td>
                  <td>
                    <span className={classes["table-text"]}>
                      {domain.product_name}
                    </span>
                  </td>
                  <td>
                    <span className={classes["table-text"]}>
                      {domain.no_mailbox}
                    </span>
                  </td>
                  <td>
                    <span>
                      <label class={classes.switch}>
                        <input
                          type="checkbox"
                          defaultChecked={domain.status}
                          onChange={(event) =>
                            changeDomainStatusHandler(
                              event,
                              domain.domain,
                              domain.uuid
                            )
                          }
                        />
                        <span
                          class={`${classes.slider} ${classes.round}`}
                        ></span>
                      </label>
                    </span>
                  </td>
                  <td>
                    <span className={classes.setting}>
                      <DowngradeIcon
                        onClick={() => {
                          setOpenDowngradeModal({
                            domain: domain.domain,
                            uuid: domain.uuid,
                          });
                        }}
                      />
                    </span>
                  </td>
                  <td>
                    <span className={classes.setting}>
                      <UpgradeIcon
                        onClick={() => {
                          setOpenUpgradeModal({
                            domain: domain.domain,
                            uuid: domain.uuid,
                            priceId: domain.price_id,
                            existingNo: domain.no_mailbox,
                          });
                        }}
                      />
                    </span>
                  </td>

                  <td>
                    <span className={classes.setting}>
                      <DeleteIcon
                        onClick={() =>
                          deleteDomainHandler(
                            domain.domain,
                            domain.subscriptionId,
                            domain.product_name,
                            domain.uuid
                          )
                        }
                      />
                    </span>
                  </td>
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
                  </tr>
                ))}
              </Fragment>
            )}
          </tbody>
        </table>
      </div>
      <AddDomainModal
        userDataList={userDataList}
        open={addDomainModal}
        setOpen={setAddDomainModal}
        setDomainData={setDomainData}
      />

      {openDowngradeModal && (
        <DowngradeDomainModal
          open={openDowngradeModal}
          setOpen={setOpenDowngradeModal}
          domainData={domainData}
          setDomainData={setDomainData}
        />
      )}
      {openUpgradeModal && (
        <UpgradeDomainModal
          open={openUpgradeModal}
          setOpen={setOpenUpgradeModal}
          domainData={domainData}
          setDomainData={setDomainData}
        />
      )}
    </div>
  );
};

function PaginatedDomains({
  itemsPerPage,
  userDataList,
  domainData,
  setDomainData,
}) {
  const auth = useSelector((state) => state.auth);
  const [searchParam, setSearchParam] = useState("");
  const [searchType, setSearchType] = useState("domain");
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = domainData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(domainData?.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % domainData.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if (!domainData) {
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
      fetch(`https://api.inspedium.email/admin/domain-list`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setDomainData(result.list);
          domainCopy = result.list;
          setSearchParam("");
        })
        .catch((error) => console.log("error", error));
    }
  }, [domainData]);

  useEffect(() => {
    if (domainData && domainCopy) {
      const filteredDomains = domainCopy.filter((domain) =>
        domain[searchType]?.toLowerCase()?.includes(searchParam?.toLowerCase())
      );
      // console.log(searchType);
      setDomainData(filteredDomains);
    }
  }, [searchParam, searchType]);

  return (
    <Fragment>
      <Domain
        userDataList={userDataList}
        domainData={domainData}
        setDomainData={setDomainData}
        currentItems={currentItems}
        setSearchParam={setSearchParam}
        setSearchType={setSearchType}
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

export default PaginatedDomains;
