import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar/NavBar";
import getWeb3 from "../getWeb3";
import GovContract from "../contracts/GovContract.json";

import { selectAccount } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

export const OfficialPage = () => {
  const account = useSelector(selectAccount);

  const [govInstance, setGovInstance] = useState();
  //const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [govID, setGovID] = useState("");

  useEffect(() => {
    // //Refresh page only once
    // if (!window.location.hash) {
    //   window.location = window.location + "#loaded";
    //   window.location.reload();
    // }
    const initialize = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        //const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = GovContract.networks[networkId];
        const instance = new web3.eth.Contract(
          GovContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Setting up instances and account
        setGovInstance(instance);
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

  const addGovOfficial = async (event) => {
    event.preventDefault();
    await govInstance.methods.addGovOfficial(account, name, govID).send({
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
        <div className="header">Government Official Registration</div>
        <form className="add-form">
          <div className="form-control">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="form-control">
            <label>Gov ID</label>
            <input
              type="text"
              value={govID}
              onChange={(e) => setGovID(e.target.value)}
              placeholder="Enter your Gov ID"
            />
          </div>

          <button
            className="btn"
            style={{ marginTop: "30px" }}
            onClick={addGovOfficial}
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
};
export default OfficialPage;
