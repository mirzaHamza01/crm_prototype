import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";

import {
  Avatar,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import OtpInput from "react-otp-input";

import LoadingComponent from "../../loadingComponent";

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

export default function CodeVerifyDialog({
  open,
  setOpen,
  setSnackOpen,
  setSnack,
  handleVerifyCodeSend,
  setCodeVerify,
  passUpdate = false,
}) {
  const [load, setLoad] = React.useState(false);
  const [resend, setResend] = React.useState(false);
  const [otpEnter, setOtpEnter] = React.useState();
  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("codeDialogOpen", false);
    setLoad(false);
    setOtpEnter();
  };

  const handleChange = (otp) => setOtpEnter(otp);
  resend &&
    setTimeout(() => {
      setResend(false);
    }, 2000);

  setTimeout(() => {
    localStorage.setItem("code", null);
  }, 300000);
  passUpdate &&
    setTimeout(() => {
      localStorage.setItem("updatePassCode", null);
    }, 300000);
  async function handleCreate() {
    const code = passUpdate
      ? localStorage.getItem("updatePassCode")
      : localStorage.getItem("code");
    if (otpEnter == code) {
      setSnackOpen(true);
      passUpdate && localStorage.setItem("codeVerify", true);

      setSnack({
        check: true,
        type: "success",
        msg: "Verification code is match",
      });
      setCodeVerify(true);
      handleClose();
    } else {
      const msg =
        code === null
          ? "Code is expired. Resend it!"
          : "Please Enter Valid code";
      setSnackOpen(true);
      setSnack({
        check: true,
        type: "error",
        msg: msg,
      });
    }
  }
  return (
    <div>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        className="customized-verify-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Enter Code Verification
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Container component="main" maxWidth="sm">
            <CssBaseline />
            <div>
              <Grid
                container
                style={{ backgroundColor: "white" }}
                justify="center"
                alignItems="center"
                spacing={3}
              >
                <Grid item container justify="center">
                  <Grid item container alignItems="center" direction="column">
                    <Grid item>
                      <Avatar style={{ backgroundColor: "red" }}>
                        <LockOutlinedIcon />
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography component="h1" variant="h5">
                        Verification Code
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Paper elevation={0}>
                    <Typography variant="h6">
                      Please enter the verification code sent to your mail
                      address
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  justify="center"
                  alignItems="center"
                  direction="column"
                >
                  <Grid item spacing={3} justify="center">
                    <OtpInput
                      style={{ color: "black" }}
                      onChange={handleChange}
                      otpType="number"
                      value={otpEnter}
                      separator={
                        <span>
                          <strong>.</strong>
                        </span>
                      }
                      inputStyle={{
                        width: "3rem",
                        height: "3rem",
                        margin: "0 1rem",
                        fontSize: "2rem",
                        borderRadius: 4,
                        border: "1px solid rgba(0,0,0,0.3)",
                      }}
                    />
                  </Grid>
                  <Grid
                    className={
                      resend &&
                      "d-flex align-items-end justify-content-around w-100"
                    }
                  >
                    {" "}
                    <Button
                      color="warning"
                      variant="contained"
                      className="mt-4"
                      onClick={() => {
                        handleVerifyCodeSend();
                        setResend(true);
                      }}
                    >
                      Resend Code
                    </Button>
                    {resend && <h5>code is resending!</h5>}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Container>
          {load && (
            <div className="mt-2">
              <LoadingComponent />
            </div>
          )}
        </DialogContent>
        <DialogActions className="d-flex justify-content-between">
          <Button color="error" variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            autoFocus
            color="success"
            variant="contained"
            onClick={handleCreate}
          >
            Verify
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
