import React from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

class OwnStorages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRequests: false,
      showApprovedRequests: false,
      showTenants: false,
      requests: [],
      approvedRequests: [],
      tenants: [],
    };
  }

  render() {
    var coldStorageIDs = this.props.coldStorageIDs;
    var coldStorageDetails = this.props.coldStorageDetails;
    var instance = this.props.instance;
    var account = this.props.account;

    //conditions to filter
    var locationToFilter = this.props.locationToFilter.toLowerCase();
    var priceToFilter = this.props.priceToFilter;
    var capacityToFilter = this.props.capacityToFilter;

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
              <li>
                Price: {coldStorageDetails[index]._price / 10 ** 18} ether
              </li>
              <Row>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={async () => {
                    try {
                      this.setState({ showRequests: !this.state.showRequests });
                      if (this.state.showRequests == false) {
                        var x = await instance.methods
                          .getRequests(ID)
                          .call({ from: account });
                        this.setState({ requests: x });
                      } else {
                        this.setState({ requests: [] });
                      }
                    } catch (error) {
                      alert("Something went wrong!");
                      console.log(error);
                    }
                  }}
                >
                  {this.state.showRequests == false
                    ? "Show Requests"
                    : "Hide Requests"}
                </button>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={async () => {
                    try {
                      this.setState({
                        showApprovedRequests: !this.state.showApprovedRequests,
                      });
                      if (this.state.showApprovedRequests == false) {
                        var x = await instance.methods
                          .getApprovedRequests(ID)
                          .call({ from: account });
                        this.setState({ approvedRequests: x });
                      } else {
                        this.setState({ approvedRequests: [] });
                      }
                    } catch (error) {
                      alert("Something went wrong!");
                      console.log(error);
                    }
                  }}
                >
                  {this.state.showApprovedRequests == false
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
                      this.setState({ showTenants: !this.state.showTenants });
                      if (this.state.showTenants == false) {
                        var x = await instance.methods
                          .getTenants(ID)
                          .call({ from: account });
                        this.setState({ tenants: x });
                      } else {
                        this.setState({ tenants: [] });
                      }
                    } catch (error) {
                      alert("Something went wrong!");
                      console.log(error);
                    }
                  }}
                >
                  {this.state.showTenants == false
                    ? "Show Tenants"
                    : "Hide Tenants"}
                </button>
              </Row>
              {this.state.showRequests === true && (
                <Row>
                  <div>
                    <h5>Requests:</h5>
                    {this.state.requests.length != 0 ? (
                      this.state.requests.map((req) => (
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
              {this.state.showApprovedRequests === true && (
                <Row>
                  <div>
                    <h5>Approved Requests:</h5>
                    {this.state.approvedRequests.length != 0 ? (
                      this.state.approvedRequests.map((app) => (
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
              {this.state.showTenants === true && (
                <Row>
                  <div>
                    <h5>Tenants:</h5>
                    {this.state.tenants.length != 0 ? (
                      this.state.tenants.map((ten) => (
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
  }
}

export default OwnStorages;
