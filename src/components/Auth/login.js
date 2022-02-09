import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CryptoJS from "crypto-js";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbars from "../../snackBar";
import { restApiGetAccessToken, restApiLoginUser } from "../../APi";
import { useHistory } from "react-router-dom";
import LoadingComponent from "../../loadingComponent";
import UpdatePassDialog from "./updatePassDialog";
import { useDispatch } from "react-redux";
import { saveToken } from "../../redux/action/userAction";
// SALT should be created ONE TIME upon sign up
const theme = createTheme();

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);
  const [codeVerify, setCodeVerify] = React.useState(
    localStorage.getItem("codeVerify") === "false" ? false : true
  );
  const [updatePassOpen, setUpdatePassOpen] = useState(
    codeVerify
      ? localStorage.getItem("updateDialogPass") === "false"
        ? false
        : true
      : false
  );
  const [load, setLoad] = useState(false);
  const [snack, setSnack] = useState({
    check: false,
    type: "error",
    msg: "",
  });

  function onChange(e) {
    e.target.id === "name"
      ? setName(e.target.value)
      : setPassword(e.target.value);
  }
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(name, password);
    if (name == "" || password == "") {
      setOpen(true);
      setSnack({ check: true, type: "error", msg: "Feilds are required!" });
    } else {
      setLoad(true);
      try {
        await restApiGetAccessToken().then(async (res) => {
          dispatch(saveToken(res));
          await restApiLoginUser(res, name).then(async (res2) => {
            console.log(res);
            if (res2.length === 0) {
              setOpen(true);
              setSnack({
                check: true,
                type: "error",
                msg: "User with this name is not exit",
              });
            } else {
              var encrypted = CryptoJS.AES.encrypt(password, name);
              console.log(encrypted.toString());
              var decrypted = CryptoJS.AES.decrypt(
                res2[0].attributes.portal_password_c,
                name
              );
              var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
              console.log({ plaintext });
              if (password === plaintext) {
                setName("");
                setPassword("");
                // dispatch(userLoginAction(true));
                localStorage.setItem("login", true);
                history.push("/");
              } else {
                setOpen(true);
                setSnack({
                  check: true,
                  type: "error",
                  msg: "Password is not match",
                });
              }
            }
          });
        });
      } catch (e) {
        setOpen(true);
        setSnack({
          check: true,
          type: "error",
          msg: "Unable to Login. Network Error!",
        });
      }
      setLoad(false);
    }
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
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              setUpdatePassOpen
              value={name}
              label="User Name"
              onChange={onChange}
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              onChange={onChange}
              value={password}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              disabled={load}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Button
                  className="mt-0 pt-0"
                  color="primary"
                  onClick={() => {
                    localStorage.setItem("updateDialogPass", true);
                    setUpdatePassOpen(true);
                  }}
                  s
                >
                  Forgot password?
                </Button>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {load && (
          <div className="mt-5">
            <LoadingComponent />
          </div>
        )}
        <UpdatePassDialog
          setSnack={setSnack}
          setSnackOpen={setOpen}
          setOpen={setUpdatePassOpen}
          setCodeVerify={setCodeVerify}
          codeVerify={codeVerify}
          open={
            localStorage.getItem("updateDialogPass") === "false" ? false : true
          }
        />
      </Container>
      {snack.check && (
        <Snackbars
          open={open}
          setOpen={setOpen}
          type={snack.type}
          msg={snack.msg}
        />
      )}
    </ThemeProvider>
  );
}
