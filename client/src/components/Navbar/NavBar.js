import React from "react";
import {
  Nav,
  NavLogo,
  NavbarContainer,
  NavIcon,
  NavMenu,
  NavMenuItem,
  NavLinks,
  NavBtn,
  NavBtnLink,
} from "./NavbarStyled";
import { MenuOutline } from "@styled-icons/evaicons-outline";

const NavBar = ({ toggle }) => {
  return (
    // <Navbar collapseOnSelect bg="dark" variant="dark">
    //   <Navbar.Brand href="/">Farmicy</Navbar.Brand>
    //   <Nav className="mr-auto">
    //     <NavDropdown title="Registration" id="basic-nav-dropdown">
    //       <NavDropdown.Item href="/FarmerPage">Farmer</NavDropdown.Item>
    //       <NavDropdown.Item href="/OfficialPage">
    //         Government Official{" "}
    //       </NavDropdown.Item>
    //       <NavDropdown.Item href="/ColdStoragePage">
    //         Cold Storage
    //       </NavDropdown.Item>
    //     </NavDropdown>
    //     <Nav.Link href="/BuyColdStorage">Buy Cold Storage</Nav.Link>
    //   </Nav>
    //   <Nav>
    //     <Nav.Link href="/login">Profile</Nav.Link>
    //   </Nav>
    // </Navbar>
    <Nav>
      <NavLogo to="/">Farmicy</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline />
        </NavIcon>
        <NavMenu>
          <NavMenuItem>
            <NavLinks to="/FarmerPage">Farmer</NavLinks>
          </NavMenuItem>
          <NavMenuItem>
            <NavLinks to="/OfficialPage">Official</NavLinks>
          </NavMenuItem>
          <NavMenuItem>
            <NavLinks to="/ColdStoragePage">Cold Storage</NavLinks>
          </NavMenuItem>
          <NavMenuItem>
            <NavLinks to="/BuyColdStorage">Buy Cold Storage</NavLinks>
          </NavMenuItem>
        </NavMenu>
      </NavbarContainer>
      <NavBtn>
        <NavBtnLink to="/login">Profile</NavBtnLink>
      </NavBtn>
    </Nav>
  );
};

export default NavBar;
