import React from "react";
import AccountsData from "../components/AccountsData";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AccountDetail from "../components/AccountDetail";
export default function CustomRouter() {
  return (
    <Routes>
      <Route path="/" element={<AccountsData />} exact />
      <Route path="/Accounts/:id" element={<AccountDetail />} />
    </Routes>
  );
}
