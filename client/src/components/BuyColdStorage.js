import React, { useState, useEffect } from "react";
import NavBar from "./Navbar/NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import { Row, Col } from "react-bootstrap";
import { AvailableStorages } from "./AvailableStorages";
import { RequestedStorages } from "./RequestedStorages";
import { ApprovedStorages } from "./ApprovedStorages";
import { OwnStorages } from "./OwnStorages";
import { RentedStorages } from "./RentedStorages";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

export const BuyColdStorage = () => {
  const [coldStorageInstance, setColdStorageInstance] = useState();
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [coldStorageIDs, setColdStorageIDs] = useState([]);
  const [coldStorageDetails, setColdStorageDetails] = useState([]);
  const [requestedIDs, setRequestedIDs] = useState([]);
  const [requestedStorages, setRequestedStorages] = useState([]);
  const [approvedIDs, setApprovedIDs] = useState([]);
  const [approvedStorages, setApprovedStorages] = useState([]);
  const [rentedIDs, setRentedIDs] = useState([]);
  const [rentedStorages, setRentedStorages] = useState([]);
  const [locationToFilter, setLocationToFilter] = useState("");
  const [capacityToFilter, setCapacityToFilter] = useState(0);
  const [priceToFilter, setPriceToFilter] = useState(0);
  const [viewToShow, setViewToShow] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      //Refresh page only once
      if (!window.location.hash) {
        window.location = window.location + "#loaded";
        window.location.reload();
      }
      try {
        // Get network provider and web3 instance.
        const web_3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web_3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web_3.eth.net.getId();
        const deployedNetwork = ColdStorageContract.networks[networkId];
        const instance = new web_3.eth.Contract(
          ColdStorageContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        //getting available cold storages
        var _coldStorageIDs = await instance.methods.getColdStorageIDs().call();

        for (let i = 0; i < _coldStorageIDs.length; i++) {
          let obj = await instance.methods
            .getColdStorage(_coldStorageIDs[i])
            .call();
          //this.state.coldStorageDetails.push(obj);
          setColdStorageDetails([...coldStorageDetails, obj]);
        }

        //getting the requested IDs and storages
        var _requestedIDs = await instance.methods
          .getCSrequested(accounts[0])
          .call();

        for (let i = 0; i < _requestedIDs.length; i++) {
          if (_requestedIDs[i] != 0) {
            let obj = await instance.methods
              .getColdStorage(_requestedIDs[i])
              .call();
            setRequestedStorages([...requestedStorages, obj]);
          }
        }

        //getting the approved IDs and storages
        var _approvedIDs = await instance.methods
          .getCSapproved(accounts[0])
          .call();

        for (let i = 0; i < _approvedIDs.length; i++) {
          if (_approvedIDs[i] != 0) {
            let obj = await instance.methods
              .getColdStorage(_approvedIDs[i])
              .call();
            setApprovedStorages([...approvedStorages, obj]);
          }
        }

        //getting the rented IDs and storages
        var _rentedIDs = await instance.methods
          .getRentedStorages(accounts[0])
          .call();

        for (let i = 0; i < _rentedIDs.length; i++) {
          if (_rentedIDs[i] != 0) {
            let obj = await instance.methods
              .getColdStorage(_rentedIDs[i])
              .call();
            setRentedStorages([...rentedStorages, obj]);
          }
        }

        setColdStorageInstance(instance);
        setAccount(accounts[0]);
        setWeb3(web_3);
        setColdStorageIDs(_coldStorageIDs);
        setRequestedIDs(_requestedIDs);
        setApprovedIDs(_approvedIDs);
        setRentedIDs(_rentedIDs);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    initialize();
  });

  return (
    <div>
      <NavBar />
      <Row style={{ height: "95vh" }}>
        <Col style={{ maxWidth: "175px" }}>
          <div className="Sidebar">
            <ul className="SidebarList">
              <li
                className="row"
                id={viewToShow == 0 ? "active" : ""}
                onClick={() => setViewToShow(0)}
              >
                Available Cold Storages
              </li>
              <li
                className="row"
                id={viewToShow == 1 ? "active" : ""}
                onClick={() => setViewToShow(1)}
              >
                Requested and Approved Cold Storages
              </li>
              <li
                className="row"
                id={viewToShow == 2 ? "active" : ""}
                onClick={() => setViewToShow(2)}
              >
                Your Cold Storages
              </li>
            </ul>
          </div>
        </Col>
        {viewToShow == 0 && (
          <Col
            sm
            style={{
              marginLeft: "20px",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1 style={{ fontSize: "30px", alignItems: "center" }}>
              Available cold storages
            </h1>
            <AvailableStorages
              coldStorageIDs={coldStorageIDs}
              coldStorageDetails={coldStorageDetails}
              locationToFilter={locationToFilter}
              priceToFilter={priceToFilter}
              capacityToFilter={capacityToFilter}
              instance={coldStorageInstance}
              account={account}
              requestedIDs={requestedIDs}
              approvedIDs={approvedIDs}
              rentedIDs={rentedIDs}
            />
          </Col>
        )}
        {viewToShow == 1 && (
          <Col
            sm
            style={{
              marginLeft: "20px",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1 style={{ fontSize: "30px" }}>Requested cold storages </h1>
            <RequestedStorages
              requestedIDs={requestedIDs}
              requestedStorages={requestedStorages}
              instance={coldStorageInstance}
              account={account}
            />
            <h1 style={{ fontSize: "30px" }}>Approved cold storages </h1>
            <ApprovedStorages
              approvedIDs={approvedIDs}
              approvedStorages={approvedStorages}
              instance={coldStorageInstance}
              account={account}
              web3={web3}
            />
          </Col>
        )}
        {viewToShow == 2 && (
          <Col
            sm
            style={{
              marginLeft: "20px",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1 style={{ fontSize: "30px" }}>Own storages </h1>
            <OwnStorages
              coldStorageIDs={coldStorageIDs}
              coldStorageDetails={coldStorageDetails}
              locationToFilter={locationToFilter}
              priceToFilter={priceToFilter}
              capacityToFilter={capacityToFilter}
              instance={coldStorageInstance}
              account={account}
            />
            <h1 style={{ fontSize: "30px" }}>Rented storages </h1>
            <RentedStorages
              rentedIDs={rentedIDs}
              rentedStorages={rentedStorages}
              instance={coldStorageInstance}
              account={account}
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
