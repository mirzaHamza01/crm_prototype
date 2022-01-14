import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import restApiRequest from "../../APi";
import EnhancedTableToolbar from "./enchancedToolBar";
import EnhancedTableHead from "./enchancedTableHead";
import { TableHead, Typography } from "@mui/material";
import LoadingComponent from "../../loadingComponent";
import { useNavigate } from "react-router-dom";

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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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

export default function DataTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [accountData, setAccountData] = React.useState();
  const [page, setPage] = React.useState(0);
  const [load, setLoad] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    setLoad(true);
    restApiRequest().then((res) => {
      setAccountData(res);
      setLoad(false);
    });
  }, []);

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

  const accountIds = [];
  const row =
    accountData &&
    accountData.entry_list.map((acc, i) => {
      let objCell = {};
      accountIds.push(acc.id)
      headCells.map((cell, c) => {
        Object.keys(acc.name_value_list).forEach((k, j) => {
          cell.id == acc.name_value_list[k].name &&
            (objCell[acc.name_value_list[k].name] =
              acc.name_value_list[k].value);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - row.length) : 0;

  const navigate = useNavigate();

  function handleNextPage(id, data, i, total) {
    navigate(`Accounts/${id}`, {
      state: {
        accountData: accountData.entry_list,
        accountIds: accountIds,
        accIndex: i,
        totalIndex: total,
      },
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
              rowCount={accountData && accountData.result_count}
              StyledTableRow={StyledTableRow}
              StyledTableCell={StyledTableCell}
              rows={accountData && row}
              rowsPerPage={rowsPerPage}
              page={page}
              headCells={headCells}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleChangePage={handleChangePage}
            />
            <TableBody className="accounts-table-data-body">
              {accountData &&
                stableSort(row, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
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
                        <StyledTableCell
                          component="th"
                          id={labelId}
                          colSpan="2"
                          scope="row"
                          padding="none"
                        >
                          <Checkbox
                            color="primary"
                            onClick={(event) => handleClick(event, row.name)}
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />{" "}
                          <span
                            onClick={() =>
                              handleNextPage(
                                accountData.entry_list[index].id,
                                accountData.entry_list[index],
                                index,
                                accountData.result_count
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {row.name}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="2"
                          style={{ "text-align": "center" }}
                          align="right"
                        >
                          {row.billing_address_country}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="2"
                          style={{ "text-align": "center" }}
                          align="right"
                        >
                          <span
                            onClick={() =>
                              handleNextPage(
                                accountData.entry_list[index].id,
                                accountData.entry_list[index],
                                index,
                                accountData.result_count
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {row.phone_office}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="2"
                          style={{ "text-align": "center" }}
                          align="right"
                        >
                          {row.assigned_user_name}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="2"
                          style={{ "text-align": "center" }}
                          align="right"
                        >
                          {row.email}
                        </StyledTableCell>
                        <StyledTableCell
                          colSpan="2"
                          style={{ "text-align": "center" }}
                          align="right"
                        >
                          {row.date_entered}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              {emptyRows > 0 && (
                <StyledTableRow>
                  <StyledTableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
          <StyledTableRow
            style={{ background: "#1965794a", display: "table", width: "100%" }}
          >
            <TablePagination
              rowsPerPageOptions={20}
              count={row.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </StyledTableRow>
        </TableContainer>
      </Paper>
    </Box>
  );
}
