import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import FarmerPage from "./components/FarmerPage";
import OfficialPage from "./components/OfficialPage";
import OfficialProfile from "./components/OfficialProfile";
import PolicyMakerPage from "./components/PolicyMakerPage";
import FarmerProfile from "./components/FarmerProfile";
import ColdStoragePage from "./components/ColdStoragePage";
import Login from "./components/login";
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
        <Route path="/FarmerProfile" component={FarmerProfile} />
        <Route path="/OfficialProfile" component={OfficialProfile} />
        <Route path="/ColdStoragePage" component={ColdStoragePage} />
      </Switch>
    </Router>
  </div>,
  document.getElementById("root")
);
