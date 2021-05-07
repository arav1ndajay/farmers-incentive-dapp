import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const NavBar = () => {
  return (
    <Navbar collapseOnSelect bg="dark" variant="dark">
      <Navbar.Brand href="/">Farmicy</Navbar.Brand>
      <Nav className="mr-auto">
        <NavDropdown title="Registration" id="basic-nav-dropdown">
          <NavDropdown.Item href="/FarmerPage">Farmer</NavDropdown.Item>
          <NavDropdown.Item href="/OfficialPage">
            Government Official{" "}
          </NavDropdown.Item>
          <NavDropdown.Item href="/ColdStoragePage">
            Cold Storage
          </NavDropdown.Item>
        </NavDropdown>
        <Nav.Link href="/BuyColdStorage">Buy Cold Storage</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="/login">Profile</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
