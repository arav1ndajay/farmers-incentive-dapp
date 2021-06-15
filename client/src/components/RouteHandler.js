import React from "react";
import Roles from "../contracts/Roles.json";
import getWeb3 from "../getWeb3";
import FarmerProfile from "./FarmerProfile";
import { OfficialProfile } from "./OfficialProfile";
import FarmerContract from "../contracts/FarmerContract.json";
import GovContract from "../contracts/GovContract.json";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import RegisteredContracts from "./RegisteredContracts";
import ManageContracts from "./ManageContracts";
import AllActions from "./AllActions";
import { Login } from "./login";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

let web3, account, networkId;

class RouteHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleId: undefined,
      data: undefined,
      loading: true,
    };
  }

  async getGeneralDetails() {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }

    try {
      web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();
      account = accounts[0];

      networkId = await web3.eth.net.getId();

      const deployedNetwork = Roles.networks[networkId];

      const instance = new web3.eth.Contract(
        Roles.abi,
        deployedNetwork && deployedNetwork.address
      );

      var _roleId = await instance.methods
        .getRole(accounts[0])
        .call({ from: accounts[0] });
      this.setState({
        roleId: _roleId,
      });
    } catch (error) {
      alert(`Error while collecting General details`);
      console.error(error);
    }
  }

  async getFarmerDetails() {
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
      _FarmerInstance: { instance },
      _web3: { web3 },
      _details: { _details },
      _account: { account },
      _policyDescriptions: { _policyDescriptions },
      _uneligibleFarmers: _uneligibleFarmers,
    };

    return obj;
  }

  async getGovernmentOfficialDetails() {
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
      _web3: web3,
      _account: account,
      _coldStorageDetails: coldStorageDetails,
      _coldStorageIDs: coldStorageIDs,
      _uneligibleFarmers: _uneligibleFarmers,
      _uneligibleOfficials: _uneligibleOfficials,
    };

    return obj;
  }

  async getFarmerArray() {
    const deployedNetwork = FarmerContract.networks[networkId];

    const instance = new web3.eth.Contract(
      FarmerContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    let arr = await instance.methods.getFarmers().call();

    return arr;
  }

  componentWillMount() {
    this.getGeneralDetails().then(() => {
      if (this.props.request === "ManageContracts") {
        this.getFarmerArray().then((result) => {
          this.setState({ data: result });

          if (this.state.data != undefined) this.setState({ loading: false });
        });
      } else if (this.isFarmer() && this.props.request === "FarmerProfile") {
        this.getFarmerDetails().then((result) => {
          this.setState({ data: result });

          if (this.state.data != undefined) this.setState({ loading: false });
        });
      } else if (
        this.isGovernmentOfficial() &&
        this.props.request === "OfficialProfile"
      ) {
        this.getGovernmentOfficialDetails().then((result) => {
          this.setState({ data: result });

          if (this.state.data != undefined) this.setState({ loading: false });
        });
      } else if (
        (this.isGovernmentOfficial() || this.isAdmin()) &&
        this.props.request === "AllActions"
      ) {
        this.getGovernmentOfficialDetails().then((result) => {
          this.setState({ data: result });

          if (this.state.data != undefined) this.setState({ loading: false });
        });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  isFarmer() {
    if (this.state.roleId == 1 || this.state.roleId == 3) return true;
    return false;
  }

  isGovernmentOfficial() {
    if (this.state.roleId == 2 || this.state.roleId == 3) return true;
    return false;
  }

  isAdmin() {
    if (this.state.roleId == 3) return true;
    return false;
  }

  isLoading() {
    if (this.state.loading === true) return true;
    return false;
  }

  render() {
    if (this.props.request === "FarmerProfile") {
      if (this.isLoading()) {
        return <h1>Loading</h1>;
      } else {
        if (this.isFarmer() == true) {
          return (
            <FarmerProfile
              FarmerInstance={this.state.data._FarmerInstance.instance}
              web3={this.state.data._web3.web3}
              account={this.state.data._account.account}
              name={this.state.data._details._details._name}
              stateOfResidence={
                this.state.data._details._details._stateOfResidence
              }
              landOwned={this.state.data._details._details._landOwned}
              gender={this.state.data._details._details._gender}
              policyDescriptions={
                this.state.data._policyDescriptions._policyDescriptions
              }
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
    } else if (this.props.request === "OfficialProfile") {
      if (this.isLoading()) {
        return <h1>Loading</h1>;
      } else {
        if (this.isGovernmentOfficial() == true) {
          return (
            <OfficialProfile
              account={this.state.data._account}
              coldStorageInstance={this.state.data._ColdStorageInstance}
              coldStorageIDs={this.state.data._coldStorageIDs}
              coldStorageDetails={this.state.data._coldStorageDetails}
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
    } else if (this.props.request === "Login") {
      return <Login roleID={this.state.roleId} />;
    } else if (this.props.request === "ManageContracts") {
      if (this.isLoading()) {
        return <h1>Loading</h1>;
      } else {
        if (this.isGovernmentOfficial()) {
          return (
            <ManageContracts
              account={account}
              web3={web3}
              farmerAccounts={this.state.data}
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
    } else if (this.props.request === "AllActions") {
      if (this.isLoading()) {
        return <h1>Loading</h1>;
      } else {
        if (this.isGovernmentOfficial() || this.isAdmin()) {
          console.log(this.state.data);
          return (
            <AllActions
              account={account}
              uneligibleFarmers={this.state.data._uneligibleFarmers}
              farmerInstance={this.state.data._FarmerInstance}
              govInstance={this.state.data._GovInstance}
              uneligibleOfficials={this.state.data._uneligibleOfficials}
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
  }
}

export default RouteHandler;
