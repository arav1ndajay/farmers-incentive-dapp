import React, { useState, useEffect } from "react";
import Roles from "../contracts/Roles.json";
import FarmerProfile from "./FarmerProfile";
import { OfficialProfile } from "./OfficialProfile";
import FarmerContract from "../contracts/FarmerContract.json";
import GovContract from "../contracts/GovContract.json";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import RegisteredContracts from "./RegisteredContracts";
import ManageContracts from "./ManageContracts";
import AllActions from "./AllActions";
import { Login } from "./login";

import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

let networkId;

export const RouteHandler = ({ request }) => {
  const account = useSelector(selectAccount);
  const web3 = useSelector(selectWeb3);

  const [roleId, setRoleId] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const getRole = async () => {
    try {
      networkId = await web3.eth.net.getId();

      const deployedNetwork = Roles.networks[networkId];

      const instance = new web3.eth.Contract(
        Roles.abi,
        deployedNetwork && deployedNetwork.address
      );

      var _roleId = await instance.methods
        .getRole(account)
        .call({ from: account });

      setRoleId(_roleId);
    } catch (error) {
      alert(`Error while collecting General details`);
      console.error(error);
    }
  };

  const getFarmerDetails = async () => {
    const deployedNetwork = FarmerContract.networks[networkId];

    const instance = new web3.eth.Contract(
      FarmerContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    let _details = await instance.methods
      .getFarmer(account)
      .call({ from: account });

    var _policyDescriptions = [];
    for (let i = 0; i < RegisteredContracts.length; i++) {
      const deployedNetwork = RegisteredContracts[i][1];

      const instance = new web3.eth.Contract(
        RegisteredContracts[i][0],
        deployedNetwork && deployedNetwork.address
      );

      var desc = {
        description: "",
        policyID: null,
      };

      let obj = await instance.methods.description().call();
      desc.description = obj._description;
      desc.policyID = obj._policyID;
      var isEligible = await instance.methods.isEligible(account).call();

      if (isEligible) {
        _policyDescriptions.push(desc);
      }
    }
    const _uneligibleFarmers = await instance.methods
      .getUnverifiedFarmers()
      .call();

    const obj = {
      _details: { _details },
      _policyDescriptions: { _policyDescriptions },
      _uneligibleFarmers: _uneligibleFarmers,
    };

    return obj;
  };

  const getGovernmentOfficialDetails = async () => {
    const deployedNetwork1 = GovContract.networks[networkId];
    const deployedNetwork2 = ColdStorageContract.networks[networkId];
    const deployedNetwork3 = FarmerContract.networks[networkId];

    const farmerInstance = new web3.eth.Contract(
      FarmerContract.abi,
      deployedNetwork3 && deployedNetwork3.address
    );

    const govInstance = new web3.eth.Contract(
      GovContract.abi,
      deployedNetwork1 && deployedNetwork1.address
    );

    const cold_instance = new web3.eth.Contract(
      ColdStorageContract.abi,
      deployedNetwork2 && deployedNetwork2.address
    );

    var coldStorageDetails = [];

    var coldStorageIDs = await cold_instance.methods.getColdStorageIDs().call();

    for (let i = 0; i < coldStorageIDs.length; i++) {
      let obj = await cold_instance.methods
        .getColdStorage(coldStorageIDs[i])
        .call();
      coldStorageDetails.push(obj);
    }

    const _uneligibleFarmers = await farmerInstance.methods
      .getUnverifiedFarmers()
      .call();

    const _uneligibleOfficials = await govInstance.methods
      .getUnverifiedOfficials()
      .call();

    const obj = {
      _ColdStorageInstance: cold_instance,
      _GovInstance: govInstance,
      _FarmerInstance: farmerInstance,
      _coldStorageDetails: coldStorageDetails,
      _coldStorageIDs: coldStorageIDs,
      _uneligibleFarmers: _uneligibleFarmers,
      _uneligibleOfficials: _uneligibleOfficials,
    };

    return obj;
  };

  const getFarmerArray = async () => {
    const deployedNetwork = FarmerContract.networks[networkId];

    const instance = new web3.eth.Contract(
      FarmerContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    let arr = await instance.methods.getFarmers().call();

    return arr;
  };

  useEffect(() => {
    const initialize = async () => {
      await getRole();
      console.log("Got role: ");
      console.log(roleId);

      if (request === "ManageContracts") {
        if (data == undefined) {
          var result = await getFarmerArray();
          console.log(result);
          setData(result);
        } else setLoading(false);
      } else if (isFarmer() && request === "FarmerProfile") {
        if (data == undefined) {
          var result = await getFarmerDetails();
          console.log(result);
          setData(result);
        } else {
          console.log("Farmer set it");
          setLoading(false);
        }
      } else if (isGovernmentOfficial() && request === "OfficialProfile") {
        if (data == undefined) {
          var result = await getGovernmentOfficialDetails();
          console.log(result);
          setData(result);
        } else setLoading(false);
      } else if (
        (isGovernmentOfficial() || isAdmin()) &&
        request === "AllActions"
      ) {
        if (data == undefined) {
          var result = await getGovernmentOfficialDetails();
          console.log(result);
          setData(result);
        } else setLoading(false);
      } else if (roleId != undefined) {
        setLoading(false);
      }
    };

    initialize();
  }, [roleId, data]);

  const isFarmer = () => {
    if (roleId == 1 || roleId == 3) return true;
    return false;
  };

  const isGovernmentOfficial = () => {
    if (roleId == 2 || roleId == 3) return true;
    return false;
  };

  const isAdmin = () => {
    if (roleId == 3) return true;
    return false;
  };

  if (request === "FarmerProfile") {
    console.log(loading);
    if (loading) {
      return <h1>Loading</h1>;
    } else {
      if (isFarmer()) {
        return (
          <FarmerProfile
            name={data._details._details._name}
            stateOfResidence={data._details._stateOfResidence}
            landOwned={data._details._details._landOwned}
            gender={data._details._details._gender}
            policyDescriptions={data._policyDescriptions._policyDescriptions}
          />
        );
      } else {
        return (
          <div>
            <h2>Not authenticated</h2>
            <a href="/">Home</a>
          </div>
        );
      }
    }
  } else if (request === "OfficialProfile") {
    if (loading) {
      return <h1>Loading</h1>;
    } else {
      if (isGovernmentOfficial()) {
        return (
          <OfficialProfile
            account={data._account}
            coldStorageInstance={data._ColdStorageInstance}
            coldStorageIDs={data._coldStorageIDs}
            coldStorageDetails={data._coldStorageDetails}
          />
        );
      } else {
        return (
          <div>
            <h2>Not authenticated</h2>
            <a href="/">Home</a>
          </div>
        );
      }
    }
  } else if (request === "Login") {
    return <Login roleID={roleId} />;
  } else if (request === "ManageContracts") {
    if (loading) {
      return <h1>Loading</h1>;
    } else {
      if (isGovernmentOfficial()) {
        return (
          <ManageContracts
            account={account}
            web3={web3}
            farmerAccounts={data}
          />
        );
      } else {
        return (
          <div>
            <h2>Not authenticated</h2>
            <a href="/">Home</a>
          </div>
        );
      }
    }
  } else if (request === "AllActions") {
    if (loading) {
      return <h1>Loading</h1>;
    } else {
      if (isGovernmentOfficial() || isAdmin()) {
        console.log(data);
        return (
          <AllActions
            account={account}
            uneligibleFarmers={data._uneligibleFarmers}
            farmerInstance={data._FarmerInstance}
            govInstance={data._GovInstance}
            uneligibleOfficials={data._uneligibleOfficials}
          />
        );
      } else {
        return (
          <div>
            <h2>Not authenticated</h2>
            <a href="/">Home</a>
          </div>
        );
      }
    }
  }
};
