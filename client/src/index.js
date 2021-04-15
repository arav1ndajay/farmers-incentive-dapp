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
import BuyColdStorage from "./components/BuyColdStorage";
import RouteHandler from "./components/RouteHandler";
import { Switch, Router, Route } from "react-router";
import history from "./history";
import ManageContracts from "./components/ManageContracts";

ReactDOM.render(
  <div>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/FarmerPage" component={FarmerPage} />
        <Route path="/OfficialPage" component={OfficialPage} />
        <Route path="/PolicyMakerPage" component={PolicyMakerPage} />
        <Route path="/Login" component={()=><RouteHandler request ="Login"/>}/>
        <Route path="/FarmerProfile" component={()=><RouteHandler request ="FarmerProfile"/>} />
        <Route path="/OfficialProfile" component={()=><RouteHandler request ="OfficialProfile"/>} />
        <Route path="/ColdStoragePage" component={ColdStoragePage} />
        <Route path="/BuyColdStorage" component={BuyColdStorage} />
        <Route path="/ManageContracts" component={()=><RouteHandler request ="ManageContracts"/>} />
      </Switch>
    </Router>
  </div>,
  document.getElementById("root")
);
