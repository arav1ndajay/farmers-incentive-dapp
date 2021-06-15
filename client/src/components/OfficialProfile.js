import React, { useState } from "react";
import NavBar from "./Navbar/NavBar";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import AllColdStorages from "./AllColdStorages";
import Container from "react-bootstrap/Container";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

export const OfficialProfile = ({
  account,
  coldStorageInstance,
  coldStorageIDs,
  coldStorageDetails,
}) => {
  const [viewToShow, setViewToShow] = useState(0);

  const [priceToFilter, setPriceToFilter] = useState(0);
  const [locationToFilter, setLocationToFilter] = useState("");
  const [capacityToFilter, setCapacityToFilter] = useState(0);

  return (
    <div>
      <NavBar />
      <Row style={{ height: "95vh" }}>
        <Col xs lg="2">
          <div className="Sidebar">
            <ul className="SidebarList">
              <li
                className="row"
                id={viewToShow == 0 ? "active" : ""}
                onClick={() => {
                  setViewToShow(0);
                }}
              >
                Verify registration details
              </li>
              <li
                className="row"
                id={viewToShow == 1 ? "active" : ""}
                onClick={() => {
                  setViewToShow(1);
                }}
              >
                Cold storage related
              </li>
            </ul>
          </div>
        </Col>
        {viewToShow == 0 && (
          <Col>
            <Container>
              <Row>
                <Link className="btn mb-3" to="/ManageContracts">
                  Manage policies
                </Link>
              </Row>
              <Row className="mt-5">
                <Link className="btn" to="/AllActions">
                  Verify Registration details
                </Link>
              </Row>
            </Container>
          </Col>
        )}

        {viewToShow == 1 && (
          <Col sm>
            <h1 style={{ fontSize: "30px" }}>All cold storages </h1>
            <AllColdStorages
              coldStorageIDs={coldStorageIDs}
              coldStorageDetails={coldStorageDetails}
              instance={coldStorageInstance}
              account={account}
              locationToFilter={locationToFilter}
              capacityToFilter={capacityToFilter}
              priceToFilter={priceToFilter}
            />
          </Col>
        )}
        <Col sm>
          <form className="add-form" style={{ maxWidth: "500px" }}>
            <div className="form-control">
              <label>Filter by price</label>
              <input
                type="number"
                placeholder="Enter upper limit on price"
                value={priceToFilter}
                onChange={(e) => setPriceToFilter(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label>Filter by capacity</label>
              <input
                type="number"
                placeholder="Enter required capacity"
                value={capacityToFilter}
                onChange={(e) => setCapacityToFilter(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label>Filter by location</label>
              <input
                type="text"
                placeholder="Enter specific location"
                value={locationToFilter}
                onChange={(e) => setLocationToFilter(e.target.value)}
              />
            </div>
          </form>
        </Col>
      </Row>
    </div>
  );
};
