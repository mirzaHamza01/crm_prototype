import EnhancedTableToolbar from "../dataTable/enchancedToolBar";
import React from "react";
import DataTable from "../dataTable";

const AccountsData = () => {
  return (
    <div className="accounts-data-container">
      <div className="accounts-data-box">
        <EnhancedTableToolbar />
        <DataTable />
      </div>
    </div>
  );
};

export default AccountsData;
