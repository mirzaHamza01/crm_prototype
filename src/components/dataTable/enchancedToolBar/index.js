import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const EnhancedTableToolbar = (props) => {

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
    </Toolbar>
  );
};


export default EnhancedTableToolbar;
