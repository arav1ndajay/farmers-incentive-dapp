import React from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

var list;

class RentedStorages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddItemForm: false,
      showItemList: false,
      nameOfItem: "",
      quantity: 0,
      currentID: null,
      itemNames: [],
      itemQuantities: [],
    };
  }

  updateNameOfItem = (event) => {
    this.setState({ nameOfItem: event.target.value });
  };

  updateQuantity = (event) => {
    this.setState({ quantity: event.target.value });
  };

  addItem = async (event) => {
    event.preventDefault();
    await this.props.instance.methods
      .addItem(
        this.state.currentID,
        this.state.nameOfItem.toLowerCase(),
        this.state.quantity
      )
      .send({
        from: this.props.account,
        gas: 1000000,
      });
    window.location.reload();
  };

  render() {
    var rentedIDs = this.props.rentedIDs;
    var rentedStorages = this.props.rentedStorages;
    var instance = this.props.instance;
    var account = this.props.account;

    var rentedStorageList = rentedIDs.map((ID, index) => {
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
              <Row>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={async () => {
                    try {
                      this.setState({ currentID: ID });
                      this.setState({
                        showAddItemForm: !this.state.showAddItemForm,
                      });
                      if (this.state.showItemList == true) {
                        this.setState({
                          showItemList: !this.state.showItemList,
                        });
                      }
                    } catch (error) {
                      alert("Something went wrong!");
                      console.log(error);
                    }
                  }}
                  // onClick={async () => {
                  //   try {
                  //     //sending the money
                  //     await web3.eth.sendTransaction(
                  //       {
                  //         from: account,
                  //         to: approvedStorages[index]._ownerAddress,
                  //         value: approvedStorages[index]._price,
                  //       },
                  //       function (err, transactionHash) {
                  //         if (err) {
                  //           console.log(err);
                  //         } else {
                  //           console.log(transactionHash);
                  //         }
                  //       }
                  //     );

                  //     //remove approved request and add tenant
                  //     await instance.methods.rentColdStorage(ID).send({
                  //       from: account,
                  //       gas: 1000000,
                  //     });

                  //     alert("Successfully bought storage!");
                  //     window.location.reload();
                  //   } catch (error) {
                  //     alert("Something went wrong. Please try again!");
                  //     console.log(error);
                  //   }
                  // }}
                >
                  {(this.state.showAddItemForm == false &&
                    this.state.currentID == ID) ||
                  this.state.currentID != ID
                    ? "Add/show items"
                    : "Hide"}
                </button>
              </Row>
              {this.state.showAddItemForm === true &&
                ID === this.state.currentID && (
                  <Row>
                    <form>
                      <div>
                        <label>Name of item</label>
                        <input
                          type="text"
                          placeholder="Enter then name of item/crop"
                          value={this.state.nameOfItem}
                          onChange={this.updateNameOfItem}
                        />
                      </div>
                      <div>
                        <label>Quantity</label>
                        <input
                          type="number"
                          placeholder="Enter quantity in KGs"
                          value={this.state.quantity}
                          onChange={this.updateQuantity}
                        />
                      </div>
                      <button
                        style={{
                          fontSize: "15px",
                          color: "white",
                          backgroundColor: "red",
                        }}
                        onClick={this.addItem}
                      >
                        Add
                      </button>
                      <button
                        style={{
                          fontSize: "15px",
                          color: "white",
                          backgroundColor: "red",
                        }}
                        onClick={async (event) => {
                          event.preventDefault();
                          this.setState({
                            showItemList: !this.state.showItemList,
                          });
                          var _itemNames = await instance.methods
                            .getItemNames(this.state.currentID)
                            .call();
                          for (let i = 0; i < _itemNames.length; i++) {
                            var _quantity = await instance.methods
                              .getItemQuantites(
                                this.state.currentID,
                                _itemNames[i]
                              )
                              .call();
                            this.state.itemQuantities.push(_quantity);
                          }
                          list = _itemNames.map((n, index) => {
                            return (
                              <li key={index}>
                                {n} : {this.state.itemQuantities[index]} Kgs
                              </li>
                            );
                          });
                          if (list.length == 0)
                            list = <li>No items stored!</li>;
                          this.setState({ itemNames: _itemNames });
                        }}
                      >
                        {this.state.showItemList == false
                          ? "Show items"
                          : "Hide items"}
                      </button>
                    </form>
                  </Row>
                )}
              {this.state.showItemList === true && this.state.currentID == ID && (
                <Row>
                  <ul>{list}</ul>
                </Row>
              )}
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
