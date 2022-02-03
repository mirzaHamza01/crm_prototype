import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { restApiGetAccessToken, restApiGetAccounts } from "../../../APi";
import EnhancedDocumentTableHead from "./EnhancedDocumentTableHead";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#66727db8",
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

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "filename",
    numeric: false,
    disablePadding: false,
    label: "File",
  },
  {
    id: "category_id",
    numeric: true,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "active_date",
    numeric: true,
    disablePadding: false,
    label: "Publish Date",
  },
];

export default function Documents({ token, DocumentsData }) {
  const [orderBy, setOrderBy] = React.useState("");
  const [expandAccor, setExpand] = useState(false);
  const [order, setOrder] = React.useState("asc");
  const [totalAccounts, setTotalAccounts] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [page, setPage] = React.useState(0);
  console.log(DocumentsData);
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };
  React.useEffect(() => {
    restApiGetAccessToken().then((token) => {
      restApiGetAccounts(token).then((res) => {
        setTotalAccounts(res);
      });
    });
  }, []);
  function descendingComparator(a, b, or66727db8derBy) {
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
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const row =
    DocumentsData &&
    DocumentsData.map((acc, i) => {
      let objCell = {};
      headCells.map((cell, c) => {
        Object.keys(acc.attributes).forEach((k, j) => {
          cell.id === k && (objCell[k] = acc.attributes[k]);
        });
      });
      return objCell;
    });
  function handleClose() {
    setExpand(!expandAccor);
  }
  return (
    <div className="account-detail-documents">
      <Accordion expanded={expandAccor}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          onClick={handleClose}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ color: "white" }}>
            <LibraryBooksIcon sx={{ color: "white" }} /> Documents
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="account-detail-documents-table">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <EnhancedDocumentTableHead
                numSelected={null}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={DocumentsData && DocumentsData.length}
                StyledTableRow={StyledTableRow}
                StyledTableCell={StyledTableCell}
                rows={DocumentsData && row}
                totalAccounts={totalAccounts}
                rowsPerPage={rowsPerPage}
                page={page}
                headCells={headCells}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleChangePage={handleChangePage}
              />
              <TableBody>
                {stableSort(row, getComparator(order, orderBy)).map(
                  (row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <StyledTableRow hover tabIndex={-1} key={index}>
                        {Object.entries(row).map((val, i) => {
                          return (
                            <StyledTableCell
                              style={{
                                textAlign: "center",
                              }}
                              component="th"
                              id={labelId}
                              colSpan="2"
                              scope="row"
                            >
                              <span>
                                {val[0] === "active_date"
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
              style={{
                background: "#1965794a",
                display: "table",
                width: "100%",
              }}
            ></StyledTableRow>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
