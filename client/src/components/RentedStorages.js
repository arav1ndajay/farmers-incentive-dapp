import React, { useState } from "react";
import "../App.css";
import { Card, Row } from "react-bootstrap";

var list;

export const RentedStorages = ({
  rentedIDs,
  rentedStorages,
  instance,
  account,
}) => {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     showAddItemForm: false,
  //     showItemList: false,
  //     nameOfItem: "",
  //     quantity: 0,
  //     currentID: null,
  //     itemNames: [],
  //     itemQuantities: [],
  //   };
  // }

  const [nameOfItem, setNameOfItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [showItemList, setShowItemList] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [itemNames, setItemNames] = useState([]);
  //const [itemQuantities, setItemQuantities] = useState([]);
  const [currentID, setCurrentID] = useState(null);

  const addItem = async (event) => {
    event.preventDefault();
    await instance.methods
      .addItem(currentID, nameOfItem.toLowerCase(), quantity)
      .send({
        from: account,
        gasPrice: 1,
      });
    window.location.reload();
  };

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
                    setCurrentID(ID);
                    setShowAddItemForm(!showAddItemForm);

                    if (showItemList) {
                      setShowItemList(!showItemList);
                    }
                  } catch (error) {
                    alert("Something went wrong!");
                    console.log(error);
                  }
                }}
              >
                {(!showAddItemForm && currentID == ID) || currentID != ID
                  ? "Add/show items"
                  : "Hide"}
              </button>
            </Row>
            {showAddItemForm && ID === currentID && (
              <Row>
                <form>
                  <div>
                    <label>Name of item</label>
                    <input
                      type="text"
                      placeholder="Enter then name of item/crop"
                      value={nameOfItem}
                      onChange={(e) => setNameOfItem(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Quantity</label>
                    <input
                      type="number"
                      placeholder="Enter quantity in KGs"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <button
                    style={{
                      fontSize: "15px",
                      color: "white",
                      backgroundColor: "red",
                    }}
                    onClick={addItem}
                  >
                    Add
                  </button>
                  <button
                    style={{
                      fontSize: "15px",
                      color: "white",
                      backgroundColor: "red",
                    }}
                    onClick={async function (event) {
                      event.preventDefault();
                      setShowItemList(!showItemList);

                      var _itemNames = await instance.methods
                        .getItemNames(currentID)
                        .call();

                      var temp = [];
                      for (let i = 0; i < _itemNames.length; i++) {
                        var _quantity = await instance.methods
                          .getItemQuantites(currentID, _itemNames[i])
                          .call();

                        temp.push(_quantity);
                      }

                      list = _itemNames.map((n, index) => {
                        return (
                          <li key={index}>
                            {n} : {temp[index]} Kgs
                          </li>
                        );
                      });
                      if (list.length == 0) list = <li>No items stored!</li>;
                      setItemNames(_itemNames);
                    }}
                  >
                    {!showItemList ? "Show items" : "Hide items"}
                  </button>
                </form>
              </Row>
            )}
            {showItemList && currentID == ID && (
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
};
