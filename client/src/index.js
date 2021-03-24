import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import FarmerPage from "./components/FarmerPage";
import OfficialPage from "./components/OfficialPage";
import PolicyMakerPage from "./components/PolicyMakerPage";
import Login from "./components/login"
import { Switch, Router, Route } from "react-router";
import history from "./history";

ReactDOM.render(
  <div>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/FarmerPage" component={FarmerPage} />
        <Route path="/OfficialPage" component={OfficialPage} />
        <Route path="/PolicyMakerPage" component={PolicyMakerPage} />
        <Route path="/Login" component={Login} />
      </Switch>
    </Router>
  </div>
  ,document.getElementById("root")
  
);
