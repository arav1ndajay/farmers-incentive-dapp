import React from "react";
import "../App.css";
import { Redirect } from "react-router-dom";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';

class Login extends React.Component {

  render() {
   
    if (this.props.roleID == 1) {
      return <Redirect to="/FarmerProfile" />;
    } 
    else if (this.props.roleID == 2) {
      return <Redirect to="/OfficialProfile" />;
    }
    else if (this.props.roleID == 3) {
      return <Redirect to="/AllActions" />;
    }
    return (
      <div>
        <NavBar />
        {this.props.roleID == 0 && (
          <Container>
            <h3>
              You have not registered, please register to acces your profile
            </h3>
            <h4>If you have already registered, 
              your registration form is still under the verification process.
              Please try again after some time.
            </h4>
            <Link to="/" className = "btn">
              Home
            </Link>
          </Container>
        )}
      </div>
    );
  }
}

export default Login;
