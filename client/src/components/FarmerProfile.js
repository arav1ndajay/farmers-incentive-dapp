import React from "react";
import NavBar from "./NavBar";
import { Card, ListGroup } from "react-bootstrap";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

class DescToList extends React.Component {
  render() {
    var policies = this.props.policyDescriptions;
    var policyList = policies.map(function (policies, index) {
      return (
        <Card key={index} style={{ margin: "20px" }}>
          <h2>Policy ID: {policies.policyID}</h2>
          <p>{policies.description}</p>
        </Card>
      );
    });

    return <ul>{policyList}</ul>;
  }
}


class FarmerProfile extends React.Component {
  
  render() {
    return (
      <div>
        <NavBar />
        <div className="row">
          <div className="col-7">
            <h1>Available policies </h1>
            <DescToList policyDescriptions={this.props.policyDescriptions} />
          </div>
          <div className="col-5">
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>Profile</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Farmer 
                </Card.Subtitle>
                <ListGroup variant="flush">
                  <ListGroup.Item>Name : {this.props.name}</ListGroup.Item>
                  <ListGroup.Item>Gender : {this.props.gender} </ListGroup.Item>
                  <ListGroup.Item>
                    State of residence : {this.props.stateOfResidence}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Land Owned : {this.props.landOwned} acre
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default FarmerProfile;
