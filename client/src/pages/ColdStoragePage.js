import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar/NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import ColdStorageContract from "../contracts/ColdStorageContract.json";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

export const ColdStoragePage = () => {
  const [coldStorageInstance, setColdStorageInstance] = useState();
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [coldStorageID, setColdStorageID] = useState(0);
  const [price, setPrice] = useState(0);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    //Refresh page only once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    const initialize = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ColdStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          ColdStorageContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setColdStorageInstance(instance);
        setAccount(accounts[0]);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    initialize();
  }, []);

  const addColdStorage = async (event) => {
    event.preventDefault();
    try {
      await coldStorageInstance.methods
        .addColdStorage(
          coldStorageID,
          ownerName,
          location,
          capacity,
          price,
          account
        )
        .send({
          from: account,
          gasPrice: 1,
        });
      alert("Successfully registered!");
      window.location.reload();
    } catch (error) {
      alert("Error while registering! Please try again!");
      console.log(error);
    }
  };

  return (
    <div>
      <NavBar />
      <h4 style={{ textAlign: "center" }}>Account address: {account}</h4>
      <div className="container">
        <div className="header">Cold Storage Registration</div>
        <form className="add-form">
          <div className="form-control">
            <label>Cold Storage ID</label>
            <input
              type="number"
              placeholder="Enter cold storage ID"
              value={coldStorageID}
              onChange={(e) => setColdStorageID(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>Owner Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location of cold storage"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>Capacity</label>
            <input
              type="number"
              placeholder="Enter capacity of cold storage"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>Price</label>
            <input
              type="number"
              placeholder="Enter price of cold storage"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button
            className="btn"
            style={{ marginTop: "30px" }}
            onClick={addColdStorage}
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
};
