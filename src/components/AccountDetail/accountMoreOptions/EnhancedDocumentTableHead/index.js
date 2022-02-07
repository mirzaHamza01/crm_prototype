import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";
import { Button, TablePagination } from "@mui/material";
function EnhancedDocumentTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
    StyledTableRow,
    StyledTableCell,
    headCells,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rows,
    handleClickOpen,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="table-data-head-container">
      <StyledTableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            colSpan="2"
            style={{ textAlign: "center" }}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
      <StyledTableRow style={{ background: "rgb(102 114 125 / 29%)" }}>
        <div className="p-2">
          <Button
            style={{ background: "#66727db8" }}
            variant="contained"
            onClick={handleClickOpen}
          >
            Create
          </Button>
        </div>
        <TablePagination
          rowsPerPageOptions={[3]}
          count={rows.length}
          className="mb-0"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledTableRow>
    </TableHead>
  );
}

export default EnhancedDocumentTableHead;
