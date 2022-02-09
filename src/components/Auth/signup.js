import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import Snackbars from "../../snackBar";
import CryptoJS from "crypto-js";
import LoadingComponent from "../../loadingComponent";
import validator from "validator";
import configData from "../../config.json";
import { restApiCreateNewUser, restApiGetAccessToken } from "../../APi";
import { useHistory } from "react-router-dom";
import CodeVerifyDialog from "./codeVerifyDialog";
const theme = createTheme();
const status = ["Active", "Inactive"];
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    backgroundColor: personName.indexOf(name) === -1 ? null : "#66727d",
    color: personName.indexOf(name) === -1 ? null : "#fff",
    "&:hover": { backgroundColor: "#66727d", color: "#fff" },
  };
}
export default function SignUp() {
  const [selectedStatus, setSelectedStatus] = React.useState(status[0]);
  const [userName, setUserName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mail, setMail] = React.useState("");
  const [mailFlag, setMailFlag] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [changeConfirmFlag, setChangeConfirmFlag] = React.useState(false);
  const [changePassFlag, setChangePassFlag] = React.useState(false);
  const [passMatch, setPassMatch] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [load, setLoad] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [codeVerify, setCodeVerify] = React.useState(false);
  const [codeVerifyOpen, setCodeVerifyOpen] = React.useState(
    localStorage.getItem("codeDialogOpen") === "false" ? false : true
  );
  const [snack, setSnack] = React.useState({
    check: false,
    type: "error",
    msg: "",
  });
  const history = useHistory();
  React.useEffect(() => {
    codeVerify && handleSubmit();
  }, [codeVerify]);

  function handleVerifyCodeSend(event) {
    event.preventDefault();
    setLoad(true);
    setChangePassFlag(true);
    const code = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("code", code);
    if (!validator.isEmail(mail)) {
      setMailFlag(true);
      setLoad(false);
    } else {
      setMailFlag(false);
      const serciveId = configData.MAIL_DATA.SERVICE_ID;
      const temId = configData.MAIL_DATA.TEMP_ID;
      const variables = {
        from_name: configData.MAIL_DATA.FROM_NAME,
        to_name: userName,
        message: `${configData.MAIL_DATA.MESSAGE} \n ${code}`,
        reply_to: mail,
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
          localStorage.setItem("codeDialogOpen", true);
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
  }
  console.log({ load }, { changePassFlag });
  const handleSubmit = async () => {
    setLoad(true);
    try {
      await restApiGetAccessToken().then(async (res) => {
        var encrypted = CryptoJS.AES.encrypt(password, userName);
        await restApiCreateNewUser(
          userName,
          firstName,
          lastName,
          encrypted.toString(),
          selectedStatus,
          mail,
          res
        ).then(async (res2) => {
          if (res2.length === 0) {
            setOpen(true);
            setSnack({
              check: true,
              type: "error",
              msg: "User with this name is not exit",
            });
            setLoad(false);
          } else {
            setOpen(true);
            setSnack({
              check: true,
              type: "success",
              msg: "user is successfully created!",
            });
            setLoad(false);
            history.push("/login");
          }
        });
      });
    } catch (e) {
      setOpen(true);
      setSnack({
        check: true,
        type: "error",
        msg: "username is already exist.",
      });
    }
    setLoad(false);
    setCodeVerify(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStatus(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="sign-up-container"
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
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
              </Grid>{" "}
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="mail"
                  onChange={(e) => {
                    setMail(e.target.value);
                  }}
                  error={mailFlag}
                  helperText={mailFlag ? "mail is not valid" : " "}
                  label="Email"
                  type="mail"
                  id="mail"
                />
              </Grid>
              <Grid item xs={12} className="pt-1">
                <div className="status-select">
                  <FormControl
                    sx={{ width: "-webkit-fill-available", mt: 3, mb: 2 }}
                  >
                    <Select
                      displayEmpty
                      fullWidth
                      value={selectedStatus}
                      onChange={handleChange}
                      input={
                        <OutlinedInput
                          className="p-0"
                          style={{ border: "1px solid #66727d" }}
                        />
                      }
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <em>{status[0]}</em>;
                        }
                        return selected;
                      }}
                      inputProps={{
                        "aria-label": "Without label",
                        sx: {
                          "&.css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root:hover":
                            {
                              backgroundColor: "#66727d",
                              color: "white",
                            },
                        },
                      }}
                    >
                      {status.map((name, i) => (
                        <MenuItem
                          key={name}
                          className="dropdown-status"
                          value={name}
                          style={getStyles(name, selectedStatus, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>
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
              {load && (
                <div className="mt-1 d-flex justify-content-center w-100">
                  <LoadingComponent />
                </div>
              )}
            </Grid>
            <Button
              fullWidth
              onClick={handleVerifyCodeSend}
              disabled={
                !userName ||
                !firstName ||
                !lastName ||
                !password ||
                !confirmPassword ||
                !passMatch
              }
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {snack.check && (
          <Snackbars
            open={open}
            setOpen={setOpen}
            type={snack.type}
            msg={snack.msg}
          />
        )}
        <CodeVerifyDialog
          handleVerifyCodeSend={handleVerifyCodeSend}
          open={codeVerifyOpen}
          setOpen={setCodeVerifyOpen}
          setCodeVerify={setCodeVerify}
          setSnackOpen={setOpen}
          setSnack={setSnack}
        />
      </Container>
    </ThemeProvider>
  );
}
