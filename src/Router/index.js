import React from "react";
import AccountsData from "../components/AccountsData";
import { Route, Switch } from "react-router-dom";
import AccountDetail from "../components/AccountDetail";
import Login from "../components/Auth/login";
import ProtectedRoute from "./privateRoute";
import SignUp from "../components/Auth/signup";
export default function CustomRouter() {
  return (
    <Switch>
      <Route path="/login" exact component={Login} />
      <Route exact path="/signup" component={SignUp} />
      <ProtectedRoute exact path="/" component={AccountsData} />
      <ProtectedRoute exact path="/Accounts/:id" component={AccountDetail} />
    </Switch>
  );
}
