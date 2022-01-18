import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, TextField } from "@mui/material";
import LoadingComponent from "../../../loadingComponent";
import { restApiGetFilterAccount } from "../../../APi";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function FilterAccounts({
  accessToken,
  open,
  setOpen,
  setFilterAccountData,
  setIsFilter,
  value,
  setValue,
  setPage,
  setSelected
}) {
  const handleClose = () => {
    setOpen(false);
    setError(false);
    setLoad(false);
  };
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async () => {
    setError(false);
    setLoad(true);
    await restApiGetFilterAccount(accessToken, value).then((res) => {
      if (res.length > 0) {
        setFilterAccountData(res);
        setIsFilter(true);
        setPage(0);
        setSelected([]);
        handleClose();
      } else {
        setError(true);
      }
    });
    setLoad(false);
  };

  function handleOnChange(e) {
    setValue(e.target.value);
    setError(false);
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="accounts-filter-dialog"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          FILTER
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <div className="d-flex align-items-center justify-content-evenly mb-4">
            <div>
              <div className="filter-label">Name</div>
            </div>
            <div className="w-50">
              <TextField
                id="outlined-basic"
                label={false}
                value={value}
                onChange={handleOnChange}
                size="small"
                variant="outlined"
                className="filter-text-field"
                InputLabelProps={{ shrink: false }}
              />
            </div>
          </div>
          {load && <LoadingComponent />}
          {error && <Alert severity="error">No record found!</Alert>}
        </DialogContent>
        <DialogActions>
          <Button
            className="filter-action-cancel-btn"
            autoFocus
            onClick={handleClose}
          >
            CANCEL{" "}
          </Button>
          <Button
            className="filter-action-search-btn"
            autoFocus
            onClick={handleSearch}
          >
            SEARCH
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
