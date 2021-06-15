import React from "react";
import ReactDOM from "react-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { FarmerPage } from "./pages/FarmerPage";
import { OfficialPage } from "./pages/OfficialPage";
import { ColdStoragePage } from "./pages/ColdStoragePage";
import { BuyColdStorage } from "./components/BuyColdStorage";
import RouteHandler from "./components/RouteHandler";
import { Switch, Router, Route } from "react-router";
import history from "./history";

ReactDOM.render(
  <div>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/FarmerPage" component={FarmerPage} />
        <Route path="/OfficialPage" component={OfficialPage} />
        <Route
          path="/Login"
          component={() => <RouteHandler request="Login" />}
        />
        <Route
          path="/FarmerProfile"
          component={() => <RouteHandler request="FarmerProfile" />}
        />
        <Route
          path="/OfficialProfile"
          component={() => <RouteHandler request="OfficialProfile" />}
        />
        <Route path="/ColdStoragePage" component={ColdStoragePage} />
        <Route path="/BuyColdStorage" component={BuyColdStorage} />
        <Route
          path="/ManageContracts"
          component={() => <RouteHandler request="ManageContracts" />}
        />
        <Route
          path="/AllActions"
          component={() => <RouteHandler request="AllActions" />}
        />
      </Switch>
    </Router>
  </div>,
  document.getElementById("root")
);
