import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import CryptoJS from "crypto-js";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, TextField } from "@mui/material";
import configData from "../../config.json";

import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../loadingComponent";
import {
  restApiGetAccessToken,
  restApiLoginUser,
  restApiUpdateUserPassword,
} from "../../APi";
import { saveToken } from "../../redux/action/userAction";
import CodeVerifyDialog from "./codeVerifyDialog";

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

export default function UpdatePassDialog({
  setOpen,
  open,
  setSnack,
  setSnackOpen,
  setCodeVerify,
  codeVerify,
}) {
  const [load, setLoad] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [changeConfirmFlag, setChangeConfirmFlag] = React.useState(false);
  const [changePassFlag, setChangePassFlag] = React.useState(false);
  const [passMatch, setPassMatch] = React.useState(false);
  const [userId, setUserId] = React.useState();
  const [token, setToken] = React.useState();
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [codeVerifyOpen, setCodeVerifyOpen] = React.useState(false);
  console.log({ token }, { userId });
  const handleClose = () => {
    setOpen(false);
    setUserName("");
    setLoad(false);
    setPassMatch(false);
    localStorage.setItem("updateDialogPass", false);
    localStorage.setItem("codeVerify", false);
    setPassword("");
    setChangeConfirmFlag(false);
    setChangePassFlag(false);
    setConfirmPassword("");
    setCodeVerify(false);
  };

  const dispatch = useDispatch();

  async function handleVerifyCodeSend(event) {
    event.preventDefault();
    setLoad(true);
    const code = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("updatePassCode", code);
    try {
      await restApiGetAccessToken().then(async (res) => {
        dispatch(saveToken(res));
        setToken(res);
        await restApiLoginUser(res, userName).then(async (res2) => {
          if (res2.length === 0) {
            setSnackOpen(true);
            setSnack({
              check: true,
              type: "error",
              msg: "User with this name is not exit",
            });
          } else {
            setUserId(res2[0].id);
            const serciveId = configData.MAIL_DATA.SERVICE_ID;
            const temId = configData.MAIL_DATA.TEMP_ID;
            const variables = {
              from_name: configData.MAIL_DATA.FROM_NAME,
              to_name: userName,
              message: `${configData.MAIL_DATA.MESSAGE} ${code}`,
              reply_to: res2[0].attributes.email1,
            };
            window.emailjs
              .send(serciveId, temId, variables)
              .then((res) => {
                setOpen(true);
                setSnack({
                  check: true,
                  type: "success",
                  msg: "Verification code is successfully sent to your mail!",
                });
                localStorage.setItem("updateDialogPass", true);
                setCodeVerifyOpen(true);
                setLoad(false);
              })
              .catch((err) => {
                setOpen(true);
                setSnack({
                  check: true,
                  type: "error",
                  msg: "Error occur while send code to your mail",
                });
              });
          }
        });
      });
    } catch (e) {
      setSnackOpen(true);
      setSnack({
        check: true,
        type: "error",
        msg: "Error occur during password updating.",
      });
      setLoad(false);
    }
  }
  async function handleUpdatePass() {
    setChangePassFlag(true);
    setLoad(true);
    var encrypted = CryptoJS.AES.encrypt(password, userName);
    console.log(encrypted.toString());
    try {
      await restApiUpdateUserPassword(userId, encrypted.toString(), token).then(
        (res3) => {
          if (res3) {
            setSnackOpen(true);
            setSnack({
              check: true,
              type: "success",
              msg: "Password is successfully update!. Try to Login again",
            });
            handleClose();
          } else {
            setSnackOpen(true);
            setSnack({
              check: true,
              type: "error",
              msg: "Error",
            });
          }
        }
      );
    } catch (e) {
      setSnackOpen(true);
      setSnack({
        check: true,
        type: "error",
        msg: "Error occur during password updating.",
      });
    }
    setLoad(false);
  }
  return (
    <div>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        className="customized-update-dialog-title"
        open={
          localStorage.getItem("updateDialogPass") === "false" ? false : true
        }
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {codeVerify
            ? " Update Password"
            : "Enter your username from Email verification"}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={16} className="overview-grid">
              {!codeVerify && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="userName"
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                    label="User Name"
                    name="userName"
                    autoFocus
                  />
                </Grid>
              )}{" "}
              {codeVerify && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      error={changePassFlag && password.length < 5}
                      helperText={
                        changePassFlag && password.length < 5
                          ? "Password legnth is must be greater or equal to 5"
                          : " "
                      }
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12} className="pt-2">
                    <TextField
                      required
                      fullWidth
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setChangeConfirmFlag(true);
                        e.target.value === password && setPassMatch(true);
                        e.target.value !== password && setPassMatch(false);
                      }}
                      error={changeConfirmFlag && password !== confirmPassword}
                      helperText={
                        changeConfirmFlag && password !== confirmPassword
                          ? "Password is not match"
                          : " "
                      }
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      autoComplete="new-password"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
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
            disabled={
              codeVerify
                ? !password || !confirmPassword || !passMatch
                : !userName
            }
            autoFocus
            color="success"
            variant="contained"
            onClick={codeVerify ? handleUpdatePass : handleVerifyCodeSend}
          >
            {codeVerify ? " Update Password" : "Verify Email"}
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <CodeVerifyDialog
        handleVerifyCodeSend={handleVerifyCodeSend}
        open={codeVerifyOpen}
        setOpen={setCodeVerifyOpen}
        setCodeVerify={setCodeVerify}
        setSnackOpen={setSnackOpen}
        setSnack={setSnack}
        passUpdate={true}
      />
    </div>
  );
}
