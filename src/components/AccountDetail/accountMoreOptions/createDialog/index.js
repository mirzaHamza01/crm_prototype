import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import {
  restApiCreateUserDocuments,
  restApiGetUserDocuments,
} from "../../../../APi";
import LoadingComponent from "../../../../loadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { saveDocData } from "../../../../redux/action/userAction";
import { Form } from "react-bootstrap";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
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
const status = ["Active", "Draft", "FQA", "Expired", "Under Review", "Pending"];
const category = ["Marketing", "Sales", "Knowledge Base"];

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

export default function CreateDialog({ setOpen, open, accountId }) {
  const theme = useTheme();
  let today = new Date().toLocaleDateString();
  const [selectedStatus, setSelectedStatus] = React.useState(status[0]);
  const [load, setLoad] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(category[0]);
  const [file, setFile] = React.useState(null);
  const [publishDate, setPublishDate] = React.useState(today);
  const [docName, setDocName] = React.useState("");
  const token = useSelector((state) => state.accounts.token);
  const ref = React.useRef();

  const [description, setDescription] = React.useState("");
  const [revision, setRevision] = React.useState(1);
  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setSelectedCategory([]);
    setSelectedStatus([]);
    setDocName("");
    setDescription("");
    setRevision(1);
    setPublishDate(today);
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStatus(typeof value === "string" ? value.split(",") : value);
  };
  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(typeof value === "string" ? value.split(",") : value);
  };
  function handleOnChange(e) {
    e.target.files.length > 0 && setFile(e.target.files[0]);
    e.target.files.length > 0 && setDocName(e.target.files[0].name);
  }
  function handleDateChange(e) {
    setPublishDate(e.target.value);
  }
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const dispatch = useDispatch();
  async function handleCreate() {
    setLoad(true);
    const baseFile = file && (await getBase64(file));
    await restApiCreateUserDocuments(
      accountId,
      selectedStatus,
      baseFile,
      docName,
      revision,
      publishDate,
      selectedCategory,
      description,
      token,
      file
    ).then(async (res) => {
      res.status === 201 &&
        (await restApiGetUserDocuments(token, accountId).then((doc) => {
          doc && dispatch(saveDocData(doc));
          doc && handleClose();
        }));

      setLoad(false);
    });
  }
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        className="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Create Document
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={16} className="overview-grid">
              <Grid item className="display-grid" xs={16}>
                <Grid>
                  <div>Status:</div>
                </Grid>
                <Grid xs={14}>
                  <div>
                    <FormControl sx={{ width: 200, mt: 3, mb: 2 }}>
                      <Select
                        displayEmpty
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
              </Grid>
              <Grid className="display-grid" item xs={16}>
                <Grid>
                  <div>File Name:</div>
                </Grid>
                <Grid xs={14}>
                  {" "}
                  <div className="d-flex mb-3">
                    <div>
                      <input
                        style={{ display: "none" }}
                        onChange={handleOnChange}
                        id="raised-button-file"
                        type="file"
                      />
                      <label htmlFor="raised-button-file">
                        <Button
                          variant="outlined"
                          color="inherit"
                          component="span"
                        >
                          Choose File
                        </Button>
                      </label>
                    </div>
                    <div className="choosen-file">
                      {file ? file.name : "No file choosen"}
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid item className="display-grid" xs={8}>
                <Grid>
                  <div>Document Name:</div>
                </Grid>
                <Grid xs={12}>
                  <Item>
                    {" "}
                    <TextField
                      required
                      className="w-100"
                      value={docName}
                      type="text"
                      onChange={(e) => {
                        setDocName(e.target.value);
                      }}
                      id="outlined-multiline-static"
                    />
                  </Item>
                </Grid>
              </Grid>
              <Grid className="display-grid" item xs={8}>
                <Grid>
                  <div>Revision:</div>
                </Grid>
                <Grid xs={12}>
                  <Item>
                    {" "}
                    <TextField
                      className="w-100"
                      value={revision}
                      type="number"
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      onChange={(e) => {
                        setRevision(e.target.value);
                      }}
                      id="outlined-multiline-static"
                    />
                  </Item>
                </Grid>
              </Grid>
              <Grid item className="display-grid" xs={8}>
                <Grid>
                  <div>Publish Date:</div>
                </Grid>
                <Grid xs={12}>
                  <Item>
                    {" "}
                    <Form.Control
                      type="date"
                      value={publishDate}
                      defaultValue={publishDate}
                      placeholder={publishDate}
                      onChange={handleDateChange}
                      id="outlined-multiline-static"
                    />
                    {/* <TextField className="w-100" type="date" /> */}
                  </Item>
                </Grid>
              </Grid>
              <Grid className="display-grid" item xs={8}>
                <Grid>
                  <div>Category:</div>
                </Grid>
                <Grid xs={12}>
                  <div>
                    <FormControl
                      sx={{ width: "-webkit-fill-available", mt: 3, mb: 2 }}
                    >
                      <Select
                        displayEmpty
                        fullWidth
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        input={
                          <OutlinedInput
                            className="p-0"
                            style={{ border: "1px solid #66727d" }}
                          />
                        }
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <em>{category[0]}</em>;
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
                        {category.map((name, i) => (
                          <MenuItem
                            key={name}
                            className="dropdown-status"
                            value={name}
                            style={getStyles(name, selectedCategory, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
              <Grid item className="display-grid" xs={16}>
                <Grid>
                  <div>Description:</div>
                </Grid>
                <Grid xs={14}>
                  <Item>
                    <TextField
                      className="w-100"
                      type="text"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      id="outlined-multiline-static"
                      multiline
                      rows={6}
                    />
                  </Item>
                </Grid>
              </Grid>
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
            disabled={!docName}
            autoFocus
            color="success"
            variant="contained"
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
