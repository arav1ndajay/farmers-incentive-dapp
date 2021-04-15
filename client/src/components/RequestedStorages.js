import React from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

class RequestedStorages extends React.Component {
  render() {
    var requestedIDs = this.props.requestedIDs;
    var requestedStorages = this.props.requestedStorages;
    var instance = this.props.instance;
    var account = this.props.account;

    var requestedStorageList = requestedIDs.map(function (ID, index) {
      if (requestedStorages[index] != null) {
        return (
          <Card key={index} style={{ marginBottom: "10px", maxWidth: "300px" }}>
            <h2>ID: {ID}</h2>
            <h2 style={{ fontSize: "20px" }}>
              Owner's address: {requestedStorages[index]._ownerAddress}
            </h2>
            <ul>
              <li>Owner name: {requestedStorages[index]._ownerName}</li>
              <li>Location: {requestedStorages[index]._location}</li>
              <li>Capacity: {requestedStorages[index]._capacity}</li>
              <li>Price: {requestedStorages[index]._price / 10 ** 18} ether</li>
              <b>Status: Pending approval</b>
              <Row>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={async () => {
                    try {
                      await instance.methods.removeRequest(account, ID).send({
                        from: account,
                        gas: 1000000,
                      });
                      alert("Request has been removed!");
                      window.location.reload();
                    } catch (error) {
                      alert("Something went wrong. Please try again!");
                      console.log(error);
                    }
                  }}
                >
                  Remove request
                </button>
              </Row>
            </ul>
          </Card>
        );
      } else return null;
    });

    if (requestedStorageList[0] != null) {
      return <ul>{requestedStorageList}</ul>;
    } else
      return (
        <div>
          <h4>You don't have any pending requests!</h4>
        </div>
      );
  }
}

export default RequestedStorages;
