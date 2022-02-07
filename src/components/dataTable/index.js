import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import configData from "../../config.json";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import {
  restApiGetAccounts,
  restApiRequest,
  restApiGetAccessToken,
  restApiGetUserDocuments,
} from "../../APi";
import EnhancedTableHead from "./enchancedTableHead";
import LoadingComponent from "../../loadingComponent";
import { useHistory } from "react-router-dom";
import FilterAccounts from "./filterAccounts";
import { useDispatch } from "react-redux";
import { saveDocData, saveToken } from "../../redux/action/userAction";

export default function DataTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [accountData, setAccountData] = React.useState();
  const [filterAccountData, setFilterAccountData] = useState();
  const [page, setPage] = React.useState(0);
  const [load, setLoad] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [totalAccounts, setTotalAccounts] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = React.useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const handleOpen = () => setOpen(true);
  const [accessToken, setAccessToken] = useState("");
  const dispatch = useDispatch();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#196579",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  React.useEffect(() => {
    setLoad(true);
    restApiGetAccessToken().then((token) => {
      setAccessToken(token);
      dispatch(saveToken(token));
      restApiGetAccounts(token).then((res) => {
        setTotalAccounts(res);
      });
      restApiRequest(token, false).then((res) => {
        setAccountData(res);
        setLoad(false);
      });
    });
  }, []);

  function handleClearFilter() {
    setValue("");
    setIsFilter(false);
  }
  let accountIds = [];
  totalAccounts.map((acc, i) => {
    accountIds.push(acc.id);
  });

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Name",
    },
    {
      id: "billing_address_country",
      numeric: false,
      disablePadding: true,
      label: "Billing Country",
    },
    {
      id: "phone_office",
      numeric: true,
      disablePadding: true,
      label: "Phone",
    },
    {
      id: "assigned_user_name",
      numeric: false,
      disablePadding: true,
      label: "User",
    },
    {
      id: "email",
      numeric: false,
      disablePadding: true,
      label: "Email Address",
    },
    {
      id: "date_entered",
      numeric: true,
      disablePadding: true,
      label: "Date Created",
    },
  ];

  const row = isFilter
    ? filterAccountData &&
      filterAccountData.map((acc, i) => {
        let objCell = {};
        headCells.map((cell, c) => {
          Object.keys(acc.attributes).forEach((k, j) => {
            cell.id == k && (objCell[k] = acc.attributes[k]);
          });
        });
        return objCell;
      })
    : accountData &&
      accountData.map((acc, i) => {
        let objCell = {};
        headCells.map((cell, c) => {
          Object.keys(acc.attributes).forEach((k, j) => {
            cell.id == k && (objCell[k] = acc.attributes[k]);
          });
        });
        return objCell;
      });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = accountData && row.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = async (event, newPage) => {
    await restApiRequest(accessToken, false, null, newPage + 1).then((res) => {
      setAccountData(res);
      setPage(newPage);
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const history = useHistory();

  async function handleNextPage(id, data, total) {
    const index = accountIds.findIndex((x) => x == id);
    await restApiGetUserDocuments(accessToken, id).then((doc) => {
      dispatch(saveDocData(doc));
      history.push({
        pathname: `${configData.MODULE.MODULE_NAME}/${id}`,
        state: {
          accountData: data,
          accountIds: accountIds,
          accIndex: index,
          totalIndex: total,
          accessToken: accessToken,
          documentData: doc,
        },
      });
    });
  }
  return load ? (
    <LoadingComponent />
  ) : (
    <Box sx={{ width: "100%" }} className="data-table-box-container">
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={accountData && accountData.length}
              StyledTableRow={StyledTableRow}
              StyledTableCell={StyledTableCell}
              rows={accountData && row}
              totalAccounts={totalAccounts}
              rowsPerPage={rowsPerPage}
              page={page}
              headCells={headCells}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleChangePage={handleChangePage}
              handleOpen={handleOpen}
              isFilter={isFilter}
              handleClearFilter={handleClearFilter}
            />
            <TableBody className="accounts-table-data-body">
              {stableSort(row, getComparator(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      {Object.entries(row).map((val, i) => {
                        return (
                          <StyledTableCell
                            key={val}
                            style={
                              val[0] === "name"
                                ? { whiteSpace: "nowrap" }
                                : { textAlign: "center" }
                            }
                            align={val[0] !== "name" ? "right" : "left"}
                            component="th"
                            id={labelId}
                            colSpan="2"
                            scope="row"
                            padding={val[0] === "name" && "none"}
                          >
                            {val[0] === "name" && (
                              <Checkbox
                                color="primary"
                                onClick={(event) =>
                                  handleClick(event, row.name)
                                }
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            )}
                            <span
                              onClick={() =>
                                (val[0] === "name" ||
                                  val[0] === "phone_office") &&
                                handleNextPage(
                                  accountData[index].id,
                                  accountData[index],
                                  totalAccounts.length
                                )
                              }
                              style={
                                val[0] === "name" || val[0] === "phone_office"
                                  ? {
                                      cursor: "pointer",
                                    }
                                  : null
                              }
                            >
                              {val[0] === "date_entered"
                                ? new Date(val[1]).toLocaleDateString()
                                : val[1]}
                            </span>
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
          <StyledTableRow
            style={{ background: "#1965794a", display: "table", width: "100%" }}
          >
            <TablePagination
              rowsPerPageOptions={[20]}
              count={isFilter ? row.length : totalAccounts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </StyledTableRow>
        </TableContainer>
      </Paper>
      <FilterAccounts
        accessToken={accessToken}
        setFilterAccountData={setFilterAccountData}
        open={open}
        setOpen={setOpen}
        setIsFilter={setIsFilter}
        handleOpen={handleOpen}
        setValue={setValue}
        value={value}
        setSelected={setSelected}
        setPage={setPage}
      />
    </Box>
  );
}
