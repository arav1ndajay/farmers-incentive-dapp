import React from "react";
import "../App.css";
import { Redirect } from "react-router-dom";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";

class Login extends React.Component {

  render() {
   
    if (this.props.roleID == 1) {
      return <Redirect to="/FarmerProfile" />;
    } 
    else if (this.props.roleID == 2) {
      return <Redirect to="/OfficialProfile" />;
    }
    
    return (
      <div>
        <NavBar />
        {this.props.roleID == 0 && (
          <div>
            <div className ="row">
            <h3>
              You have not registered, please register as Farmer, Official
              or Policy maker
            </h3>
            </div>
            <Link to="/" className="btn btn-primary">
              Home
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default Login;
