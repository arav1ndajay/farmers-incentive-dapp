//Exclusively for government officials
import React from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

var list;

class AllColdStorages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showItemList: false,
      showTotalItemsList: false,
      currentID: null,
      itemNames: [],
      itemQuantities: [],
      allItems: [],
      allItemQuantities: [],
    };
  }

  render() {
    var instance = this.props.instance;
    var account = this.props.account;

    var coldStorageDetails = this.props.coldStorageDetails;
    var coldStorageIDs = this.props.coldStorageIDs;

    //conditions to filter
    var locationToFilter = this.props.locationToFilter.toLowerCase();
    var priceToFilter = this.props.priceToFilter;
    var capacityToFilter = this.props.capacityToFilter;

    var coldStorageList = coldStorageIDs.map((ID, index) => {
      if (
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
                    await this.setState({ currentID: ID });

                    this.setState({
                      showItemList: !this.state.showItemList,
                    });
                    var _itemNames = await instance.methods
                      .getItemNames(this.state.currentID)
                      .call();

                    for (let i = 0; i < _itemNames.length; i++) {
                      var _quantity = await instance.methods
                        .getItemQuantites(this.state.currentID, _itemNames[i])
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
                    if (list.length == 0) list = <li>No items stored!</li>;
                    this.setState({ itemNames: _itemNames });
                  }}
                >
                  {(this.state.showItemList == false &&
                    this.state.currentID == ID) ||
                  this.state.currentID != ID
                    ? "View stored items"
                    : "Hide stored items"}
                </button>
              </Row>
              {this.state.showItemList === true && this.state.currentID == ID && (
                <Row>
                  <ul>{list}</ul>
                </Row>
              )}
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
      return (
        <div>
          <ul>{coldStorageList}</ul>
          <button
            style={{
              fontSize: "15px",
              color: "white",
              backgroundColor: "red",
            }}
            onClick={async () => {
              this.setState({
                showTotalItemsList: !this.state.showTotalItemsList,
              });

              for (let i = 0; i < coldStorageIDs.length; i++) {
                var _itemNames = await instance.methods
                  .getItemNames(coldStorageIDs[i])
                  .call();

                for (let j = 0; j < _itemNames.length; j++) {
                  var _quantity = await instance.methods
                    .getItemQuantites(coldStorageIDs[i], _itemNames[j])
                    .call();
                  this.state.itemQuantities.push(_quantity);

                  if (
                    !this.state.allItems.includes(_itemNames[j].toLowerCase())
                  ) {
                    this.state.allItems.push(_itemNames[j].toLowerCase());
                  }

                  if (
                    this.state.allItemQuantities[
                      this.state.allItems.indexOf(_itemNames[j].toLowerCase())
                    ] == undefined
                  ) {
                    this.state.allItemQuantities[
                      this.state.allItems.indexOf(_itemNames[j].toLowerCase())
                    ] = parseInt(_quantity);
                  } else {
                    this.state.allItemQuantities[
                      this.state.allItems.indexOf(_itemNames[j].toLowerCase())
                    ] += parseInt(_quantity);
                  }
                }
              }
              list = this.state.allItems.map((n, index) => {
                return (
                  <li key={index}>
                    {n} : {this.state.allItemQuantities[index]} Kgs
                  </li>
                );
              });
              if (list.length == 0) list = <li>No items stored!</li>;
              this.setState({ itemNames: _itemNames });

              console.log(this.state.allItems);
              console.log(this.state.allItemQuantities);
            }}
          >
            {this.state.showTotalItemsList == false
              ? "View total stored items"
              : "Hide total stored items"}
          </button>
          {this.state.showTotalItemsList === true && (
            <Row>
              <ul>{list}</ul>
            </Row>
          )}
        </div>
      );
    } else
      return (
        <div>
          <h4>There are no cold storages!</h4>
        </div>
      );
  }
}

export default AllColdStorages;
