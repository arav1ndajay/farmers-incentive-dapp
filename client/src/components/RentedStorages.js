import React from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

class RentedStorages extends React.Component {
  render() {
    var rentedIDs = this.props.rentedIDs;
    var rentedStorages = this.props.rentedStorages;
    var instance = this.props.instance;
    var account = this.props.account;

    var rentedStorageList = rentedIDs.map(function (ID, index) {
      if (rentedStorages[index] != null) {
        return (
          <Card key={index} style={{ marginBottom: "10px", maxWidth: "300px" }}>
            <h2>ID: {ID}</h2>
            <h2 style={{ fontSize: "20px" }}>
              Owner's address: {rentedStorages[index]._ownerAddress}
            </h2>
            <ul>
              <li>Owner name: {rentedStorages[index]._ownerName}</li>
              <li>Location: {rentedStorages[index]._location}</li>
              <li>Capacity: {rentedStorages[index]._capacity}</li>
              <li>Price: {rentedStorages[index]._price / 10 ** 18} ether</li>
            </ul>
          </Card>
        );
      } else return null;
    });

    if (rentedStorageList[0] != null) {
      return <ul>{rentedStorageList}</ul>;
    } else
      return (
        <div>
          <h4>You don't have any rented storages.</h4>
        </div>
      );
  }
}

export default RentedStorages;
