import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import { useHistory } from "react-router-dom";
const EnhancedTableToolbar = (props) => {
  const history = useHistory();
  function handleLogout() {
    localStorage.setItem("login", false);
    history.push("/login");
  }
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        ACCOUNTS
      </Typography>
      <IconButton onClick={handleLogout} aria-label="logout" size="large">
        <LogoutIcon fontSize="inherit" />
      </IconButton>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
