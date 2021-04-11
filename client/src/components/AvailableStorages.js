import React from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

class AvailableStorages extends React.Component {
  render() {
    var coldStorageIDs = this.props.coldStorageIDs;
    var coldStorageDetails = this.props.coldStorageDetails;
    var instance = this.props.instance;
    var account = this.props.account;
    var requestedIDs = this.props.requestedIDs;

    //conditions to filter
    var locationToFilter = this.props.locationToFilter.toLowerCase();
    var priceToFilter = this.props.priceToFilter;
    var capacityToFilter = this.props.capacityToFilter;

    var coldStorageList = coldStorageIDs.map(function (ID, index) {
      if (
        requestedIDs.includes(ID) == false &&
        account != coldStorageDetails[index]._ownerAddress &&
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
          <Card key={index} style={{ marginBottom: "10px", maxWidth: "300px" }}>
            <h2>ID: {ID}</h2>
            <h2 style={{ fontSize: "20px" }}>
              Owner's address: {coldStorageDetails[index]._ownerAddress}
            </h2>
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
                      console.log(typeof account);
                      await instance.methods.requestColdStorage(ID).send({
                        from: account,
                        gas: 1000000,
                      });
                      alert("Request has been placed!");
                      window.location.reload();
                    } catch (error) {
                      alert(
                        "You are the owner of this storage! Or something went wrong. Please try again!"
                      );
                      console.log(error);
                    }
                  }}
                >
                  Request cold storage
                </button>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={async () => {
                    try {
                      var x = await instance.methods
                        .getRequests(ID)
                        .call({ from: account });
                      console.log(x);
                    } catch (error) {
                      alert("You are not the owner!");
                      console.log(error);
                    }
                  }}
                >
                  Show Requests
                </button>
              </Row>
            </ul>
          </Card>
        );
      }
    });
    if (coldStorageList != null) {
      return <ul>{coldStorageList}</ul>;
    } else return <div></div>;
  }
}

export default AvailableStorages;
