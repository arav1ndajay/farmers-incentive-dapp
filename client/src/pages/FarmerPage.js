import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar/NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

export const FarmerPage = () => {
  const [farmerInstance, setFarmerInstance] = useState();
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [stateOfResidence, setStateOfResidence] = useState("");
  const [landOwned, setLandOwned] = useState(0);
  const [gender, setGender] = useState("");

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
        const deployedNetwork = FarmerContract.networks[networkId];
        const instance = new web3.eth.Contract(
          FarmerContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.

        setFarmerInstance(instance);
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

  const addFarmer = async (event) => {
    event.preventDefault();
    await farmerInstance.methods
      .addFarmer(account, name, stateOfResidence, gender, landOwned)
      .send({
        from: account,
        gasPrice: 1,
      });
    window.location.reload();
  };

  return (
    <div>
      <NavBar />
      <h4 style={{ textAlign: "center" }}>Account address: {account}</h4>
      <div className="container">
        <div className="header">Farmer Registration</div>
        <form className="add-form">
          <div className="form-control">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>Land owned</label>
            <input
              type="text"
              placeholder="Enter area in acres"
              value={landOwned}
              onChange={(e) => setLandOwned(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>State of Residence</label>
            <select
              style={{ fontSize: "25px", width: "600px" }}
              value={stateOfResidence}
              onChange={(e) => setStateOfResidence(e.target.value)}
            >
              <option value="">Select</option>
              <option value="kerala">Kerala</option>
              <option value="bihar">Bihar</option>
              <option value="andhrapradesh">Andhra Pradesh</option>
              <option value="telangana">Telangana</option>
              <option value="goa">Goa</option>
              <option value="maharasthra">Maharasthra</option>
              <option value="arunachalpradesh">Arunachal Pradesh</option>
              <option value="assam">Assam</option>
              <option value="chhattisgarh">Chhattisgarh</option>
              <option value="gujarat">Gujarat</option>
              <option value="haryana">Haryana</option>
              <option value="himachalpradesh">Himachal Pradesh</option>
              <option value="jharkhand">Jharkhand</option>
              <option value="karnataka">Karnataka</option>
              <option value="madhyapradesh">Madhya Pradesh</option>
              <option value="manipur">Manipur</option>
              <option value="meghalaya">Meghalaya</option>
              <option value="mizoram">Mizoram</option>
              <option value="nagaland">Nagaland</option>
              <option value="odisha">Odisha</option>
              <option value="punjab">Punjab</option>
              <option value="rajasthan">Rajasthan</option>
              <option value="sikkim">Sikkim</option>
              <option value="tamilnadu">Tamil Nadu</option>
              <option value="tripura">Tripura</option>
              <option value="uttarpradesh">Uttar Pradesh</option>
              <option value="uttarakhand">Uttarakhand</option>
              <option value="westbengal">West Bengal</option>
            </select>
          </div>

          <div className="form-control">
            <label>Gender</label>
            <select
              style={{ fontSize: "25px", width: "600px" }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            className="btn"
            style={{ marginTop: "30px" }}
            onClick={addFarmer}
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
};
