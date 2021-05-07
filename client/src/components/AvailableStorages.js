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
    var approvedIDs = this.props.approvedIDs;
    var rentedIDs = this.props.rentedIDs;

    //conditions to filter
    var locationToFilter = this.props.locationToFilter.toLowerCase();
    var priceToFilter = this.props.priceToFilter;
    var capacityToFilter = this.props.capacityToFilter;

    var coldStorageList = coldStorageIDs.map(function (ID, index) {
      if (
        requestedIDs.includes(ID) == false &&
        approvedIDs.includes(ID) == false &&
        rentedIDs.includes(ID) == false &&
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
          <Card key={index} style={{ marginBottom: "10px", maxWidth: "500px" }}>
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
              </Row>
            </ul>
          </Card>
        );
      } else return;
    });
    let t = false;
    for (let i = 0; i < coldStorageList.length; i++) {
      if (typeof coldStorageList[i] != "undefined") {
        t = true;
      }
    }

    if (t) {
      return <ul>{coldStorageList}</ul>;
    } else
      return (
        <div>
          <h4>There are no cold storages available!</h4>
        </div>
      );
  }
}

export default AvailableStorages;
