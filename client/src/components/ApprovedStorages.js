import React from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

class ApprovedStorages extends React.Component {
  render() {
    var approvedIDs = this.props.approvedIDs;
    var approvedStorages = this.props.approvedStorages;
    var instance = this.props.instance;
    var account = this.props.account;
    var web3 = this.props.web3;

    var approvedStorageList = approvedIDs.map(function (ID, index) {
      if (approvedStorages[index] != null) {
        return (
          <Card key={index} style={{ marginBottom: "10px", maxWidth: "300px" }}>
            <h2>ID: {ID}</h2>
            <h2 style={{ fontSize: "20px" }}>
              Owner's address: {approvedStorages[index]._ownerAddress}
            </h2>
            <ul>
              <li>Owner name: {approvedStorages[index]._ownerName}</li>
              <li>Location: {approvedStorages[index]._location}</li>
              <li>Capacity: {approvedStorages[index]._capacity}</li>
              <li>Price: {approvedStorages[index]._price / 10 ** 18} ether</li>
              <Row>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={async () => {
                    try {
                      //sending the money
                      await web3.eth.sendTransaction(
                        {
                          from: account,
                          to: approvedStorages[index]._ownerAddress,
                          value: approvedStorages[index]._price,
                        },
                        function (err, transactionHash) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(transactionHash);
                          }
                        }
                      );

                      //remove approved request and add tenant
                      await instance.methods.rentColdStorage(ID).send({
                        from: account,
                        gasPrice: 1,
                      });

                      alert("Successfully bought storage!");
                      window.location.reload();
                    } catch (error) {
                      alert("Something went wrong. Please try again!");
                      console.log(error);
                    }
                  }}
                >
                  Buy storage
                </button>
              </Row>
            </ul>
          </Card>
        );
      } else return null;
    });

    if (approvedStorageList[0] != undefined) {
      return <ul>{approvedStorageList}</ul>;
    } else
      return (
        <div>
          <h4>No storages approved for buying!</h4>
        </div>
      );
  }
}

export default ApprovedStorages;
