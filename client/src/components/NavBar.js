import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Form, Nav, Button, FormControl } from "react-bootstrap";

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Farmer DaPP</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/FarmerPage">Farmer Registration</Nav.Link>
        <Nav.Link href="/OfficialPage">Official Page</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
