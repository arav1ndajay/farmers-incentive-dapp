import React, { useState } from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

export const OwnStorages = ({
  coldStorageIDs,
  coldStorageDetails,
  instance,
  account,
  locationToFilter,
  priceToFilter,
  capacityToFilter,
}) => {
  const [requests, setRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [tenants, setTenants] = useState([]);

  const [showRequests, setShowRequests] = useState(false);
  const [showApprovedRequests, setShowApprovedRequests] = useState(false);
  const [showTenants, setShowTenants] = useState(false);

  var coldStorageList = coldStorageIDs.map((ID, index) => {
    if (
      account == coldStorageDetails[index]._ownerAddress &&
      (coldStorageDetails[index]._location
        .toLowerCase()
        .includes(locationToFilter) ||
        locationToFilter === "") &&
      (priceToFilter == 0 ||
        parseInt(coldStorageDetails[index]._price) / 10 ** 18 <=
          priceToFilter) &&
      (capacityToFilter === 0 ||
        parseInt(coldStorageDetails[index]._capacity) >= capacityToFilter)
    ) {
      return (
        <Card
          key={index}
          style={{
            marginBottom: "10px",
            maxWidth: "500px",
          }}
        >
          <h2>ID: {ID}</h2>

          <ul>
            <li>Owner name: {coldStorageDetails[index]._ownerName}</li>
            <li>Location: {coldStorageDetails[index]._location}</li>
            <li>Capacity: {coldStorageDetails[index]._capacity}</li>
            <li>Price: {coldStorageDetails[index]._price / 10 ** 18} ether</li>
            <Row>
              <button
                style={{
                  fontSize: "15px",
                  color: "white",
                  backgroundColor: "red",
                }}
                onClick={async () => {
                  try {
                    setShowRequests(!showRequests);
                    if (!showRequests) {
                      var x = await instance.methods
                        .getRequests(ID)
                        .call({ from: account });
                      setRequests(x);
                    } else {
                      setRequests([]);
                    }
                  } catch (error) {
                    alert("Something went wrong!");
                    console.log(error);
                  }
                }}
              >
                {!showRequests ? "Show Requests" : "Hide Requests"}
              </button>
              <button
                style={{
                  fontSize: "15px",
                  color: "white",
                  backgroundColor: "red",
                }}
                onClick={async () => {
                  try {
                    setShowApprovedRequests(!showApprovedRequests);
                    if (!showApprovedRequests) {
                      var x = await instance.methods
                        .getApprovedRequests(ID)
                        .call({ from: account });
                      setApprovedRequests(x);
                    } else {
                      setApprovedRequests([]);
                    }
                  } catch (error) {
                    alert("Something went wrong!");
                    console.log(error);
                  }
                }}
              >
                {!showApprovedRequests
                  ? "Show Approved Requests"
                  : "Hide Approved Requests"}
              </button>
              <button
                style={{
                  fontSize: "15px",
                  color: "white",
                  backgroundColor: "red",
                }}
                onClick={async () => {
                  try {
                    setShowTenants(!showTenants);
                    if (!showTenants) {
                      var x = await instance.methods
                        .getTenants(ID)
                        .call({ from: account });
                      setTenants(x);
                    } else {
                      setTenants([]);
                    }
                  } catch (error) {
                    alert("Something went wrong!");
                    console.log(error);
                  }
                }}
              >
                {!showTenants ? "Show Tenants" : "Hide Tenants"}
              </button>
            </Row>
            {showRequests && (
              <Row>
                <div>
                  <h5>Requests:</h5>
                  {requests.length != 0 ? (
                    requests.map((req) => (
                      <div key={req}>
                        <li key={req} style={{ fontSize: "14px" }}>
                          {req}
                        </li>
                        <button
                          style={{
                            fontSize: "15px",
                            color: "white",
                            backgroundColor: "green",
                          }}
                          onClick={async () => {
                            try {
                              console.log(ID);
                              console.log(req);
                              await instance.methods
                                .approveColdStorage(ID, req)
                                .send({
                                  from: account,
                                  gasPrice: 1,
                                });

                              alert("Request has been approved!");
                              window.location.reload();
                            } catch (error) {
                              alert("Transaction cancelled/errored!");
                              console.log(error);
                            }
                          }}
                        >
                          Approve request
                        </button>
                      </div>
                    ))
                  ) : (
                    <h5>There are no requests!</h5>
                  )}
                </div>
              </Row>
            )}
            {showApprovedRequests && (
              <Row>
                <div>
                  <h5>Approved Requests:</h5>
                  {approvedRequests.length != 0 ? (
                    approvedRequests.map((app) => (
                      <div key={app}>
                        <li key={app} style={{ fontSize: "14px" }}>
                          {app}
                        </li>
                      </div>
                    ))
                  ) : (
                    <h5>There are no approved requests!</h5>
                  )}
                </div>
              </Row>
            )}
            {showTenants === true && (
              <Row>
                <div>
                  <h5>Tenants:</h5>
                  {tenants.length != 0 ? (
                    tenants.map((ten) => (
                      <div key={ten}>
                        <li key={ten} style={{ fontSize: "14px" }}>
                          {ten}
                        </li>
                      </div>
                    ))
                  ) : (
                    <h5>There are no tenants!</h5>
                  )}
                </div>
              </Row>
            )}
          </ul>
        </Card>
      );
    } else return;
  });
  let t = false;
  for (let i = 0; i < coldStorageList.length; i++) {
    if (typeof coldStorageList[i] != "undefined") t = true;
  }
  if (t) {
    return <ul>{coldStorageList}</ul>;
  } else
    return (
      <div>
        <h4>You don't own any storages!</h4>
      </div>
    );
};
