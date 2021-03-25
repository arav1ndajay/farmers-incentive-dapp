import React from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import {Navbar, Form, Nav, Button, FormControl} from 'react-bootstrap';
=======
import { Navbar, Form, Nav, Button, FormControl } from "react-bootstrap";
>>>>>>> e997fb465e7f88c41031fa7584019348b4a73a11

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
<<<<<<< HEAD
    <Navbar.Brand href="/">Farmer DaPP</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/FarmerPage">Farmer Registration</Nav.Link>
      <Nav.Link href="/OfficialPage">Official Page</Nav.Link>
    </Nav>
    <Nav>
      <Nav.Link href ="/login">Login</Nav.Link>
    </Nav>
  </Navbar>
=======
      <Navbar.Brand href="/">Farmer DaPP</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/FarmerPage">Farmer Registration</Nav.Link>
        <Nav.Link href="/OfficialPage">Official Page</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav>
    </Navbar>
>>>>>>> e997fb465e7f88c41031fa7584019348b4a73a11
  );
};

export default NavBar;
