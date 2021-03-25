import React from "react";
import { Navbar, Nav} from "react-bootstrap";

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Farmer DaPP</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/FarmerPage">Farmer Registration</Nav.Link>
        <Nav.Link href="/OfficialPage">Government Official</Nav.Link>
        <Nav.Link href="/PolicyMakerPage">Policy Maker</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
