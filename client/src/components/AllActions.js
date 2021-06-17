import React from "react";
import NavBar from "./Navbar/NavBar";
import "../App.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class FarmerForm extends React.Component {
  //props account, farmerInstance, farmerDetails

  constructor(props) {
    super(props);

    this.state = {
      viewDetails: false,
      farmerDetails: undefined,
      addressOfFarmer: "",
    };
  }

  viewFarmerDetails = async (event) => {
    event.preventDefault();
    try {
      console.log("Farmer address and instance");
      console.log(this.state.addressOfFarmer);
      console.log(this.props.farmerInstance);
      const _farmerDetails = await this.props.farmerInstance.methods
        .getFarmer(this.state.addressOfFarmer)
        .call({ from: this.props.account });

      this.setState({ farmerDetails: _farmerDetails });

      this.setState({ viewDetails: true });
    } catch (error) {
      this.setState({ viewDetails: false });
      alert("Invalid address, please try again!");
      console.error(error);
    }
  };

  setFarmerAsEligible = async (event) => {
    event.preventDefault();
    await this.props.govInstance.methods
      .setFarmerAsEligible(this.state.addressOfFarmer)
      .send({
        from: this.props.account,
        gasPrice: 1,
      });
    window.location.reload();
  };

  updateAddressOfFarmer = (event) => {
    this.setState({ addressOfFarmer: event.target.value });
  };

  render() {
    return (
      <div>
        <form className="add-form">
          <div className="form-control">
            <label>Address of farmer</label>
            <input
              type="text"
              value={this.state.addressOfFarmer}
              onChange={this.updateAddressOfFarmer}
              placeholder="Enter address of farmer"
            />
          </div>
          <button
            className="btn"
            style={{ marginBottom: "30px" }}
            onClick={this.viewFarmerDetails}
          >
            View Details
          </button>
          <input
            type="submit"
            value="Verify details"
            className="btn"
            onClick={this.setFarmerAsEligible}
          />
        </form>
        {this.state.viewDetails === true && (
          <div>
            <h4 style={{ textAlign: "center" }}>
              Details of farmer {this.state.addressOfFarmer}
            </h4>
            <div style={{ textAlign: "center" }}>
              Name: {this.state.farmerDetails._name}
            </div>
            <div style={{ textAlign: "center" }}>
              Gender: {this.state.farmerDetails._gender}
            </div>
            <div style={{ textAlign: "center" }}>
              Land Owned: {this.state.farmerDetails._landOwned}
            </div>
            <div style={{ textAlign: "center" }}>
              Place of Residence: {this.state.farmerDetails._stateOfResidence}
            </div>
            <div style={{ textAlign: "center" }}>
              Is Eligible for Incentive:{" "}
              {this.state.farmerDetails.isEligible.toString()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

class OfficialForm extends React.Component {
  //props account, OfficialInstance, farmerDetails

  constructor(props) {
    super(props);

    this.state = {
      viewDetails: false,
      OfficialDetails: undefined,
      addressOfOfficial: undefined,
    };
  }

  viewOfficialDetails = async (event) => {
    event.preventDefault();
    try {
      const _officialDetails = await this.props.officialInstance.methods
        .getOfficial(this.state.addressOfOfficial)
        .call({ from: this.props.account });

      this.setState({ OfficialDetails: _officialDetails });

      this.setState({ viewDetails: true });
    } catch (error) {
      this.setState({ viewDetails: false });
      alert("Invalid address, please try again!");
      console.error(error);
    }
  };

  setAsEligible = async (event) => {
    event.preventDefault();
    await this.props.officialInstance.methods
      .verifyOfficial(this.state.addressOfOfficial)
      .send({
        from: this.props.account,
        gasPrice: 1,
      });
    window.location.reload();
  };

  updateAddress = (event) => {
    this.setState({ addressOfOfficial: event.target.value });
  };

  render() {
    return (
      <div>
        <form className="add-form">
          <div className="form-control">
            <label>Address of Government official</label>
            <input
              type="text"
              value={this.state.addressOfOfficial}
              onChange={this.updateAddress}
              placeholder="Enter address of Official"
            />
          </div>
          <button
            className="btn"
            style={{ marginBottom: "30px" }}
            onClick={this.viewOfficialDetails}
          >
            View Details
          </button>
          <input
            type="submit"
            value="Verify details"
            className="btn"
            onClick={this.setAsEligible}
          />
        </form>
        {this.state.viewDetails === true && (
          <div>
            <h4 style={{ textAlign: "center" }}>
              Details of Official {this.state.addressOfOfficial}
            </h4>
            <div style={{ textAlign: "center" }}>
              Name: {this.state.OfficialDetails._name}
            </div>
            <div style={{ textAlign: "center" }}>
              Gov ID: {this.state.OfficialDetails._govId}
            </div>
          </div>
        )}
      </div>
    );
  }
}

class FarmerArraytoList extends React.Component {
  // prop needed: UneligibleFarmers array
  render() {
    var farmerArray = this.props.uneligibleFarmers;

    var farmerList = farmerArray.map(function (farmerArrayObj) {
      return <li key={farmerArrayObj}> {farmerArrayObj} </li>;
    });

    return (
      <div>
        <h1>Ineligible Farmers List</h1>
        <ul>{farmerList}</ul>
      </div>
    );
  }
}

class OfficialArraytoList extends React.Component {
  // prop needed: UneligibleFarmers array
  render() {
    var officialArray = this.props.uneligibleOfficials;

    var officialList = officialArray.map(function (officialArrayObj) {
      return <li> {officialArrayObj} </li>;
    });

    return (
      <div>
        <h1>Unverified Officials List</h1>
        <ul>{officialList}</ul>
      </div>
    );
  }
}

class FarmerActions extends React.Component {
  render() {
    return (
      <Row>
        <Col>
          <FarmerArraytoList uneligibleFarmers={this.props.uneligibleFarmers} />
        </Col>
        <Col>
          <FarmerForm
            farmerInstance={this.props.farmerInstance}
            govInstance={this.props.govInstance}
            account={this.props.account}
          />
        </Col>
      </Row>
    );
  }
}

class OfficialActions extends React.Component {
  render() {
    return (
      <Row>
        <Col>
          <OfficialArraytoList
            uneligibleOfficials={this.props.uneligibleOfficials}
          />
        </Col>
        <Col>
          <OfficialForm
            officialInstance={this.props.officialInstance}
            account={this.props.account}
          />
        </Col>
      </Row>
    );
  }
}

class AllActions extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <FarmerActions
          farmerInstance={this.props.farmerInstance}
          account={this.props.account}
          govInstance={this.props.govInstance}
          uneligibleFarmers={this.props.uneligibleFarmers}
        />

        <OfficialActions
          officialInstance={this.props.govInstance}
          account={this.props.account}
          uneligibleOfficials={this.props.uneligibleOfficials}
        />
      </div>
    );
  }
}

export default AllActions;
