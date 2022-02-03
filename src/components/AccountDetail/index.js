import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Overview from "./overview";
import { Router, useLocation, useHistory, useParams } from "react-router-dom";
import MoreInfo from "./moreInfo";
import OtherInfo from "./other";
import { Button } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { restApiRequest, restApiGetUserDocuments } from "../../APi";
import LoadingComponent from "../../loadingComponent";
import Documents from "./accountMoreOptions/documents";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AccountDetail(props) {
  const [value, setValue] = React.useState(0);
  const { state } = useLocation();
  const {
    accountData,
    accIndex,
    totalIndex,
    accountIds,
    accessToken,
    documentData,
  } = state;
  const [load, setLoad] = React.useState(false);
  const [curIndex, setCurIndex] = useState(accIndex);
  const [token, setToken] = useState(accessToken);
  const [currentAccData, setCurrentAccData] = React.useState(accountData);
  const [currentAccDocData, setCurrentAccDocData] =
    React.useState(documentData);
  const history = useHistory();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function handleIncrement() {
    setLoad(true);
    let count = curIndex + 1;
    await restApiRequest(token, true, accountIds[count]).then(async (res) => {
      setCurrentAccData(res);
      setCurIndex(count);
      await restApiGetUserDocuments(token, accountIds[count]).then((doc) => {
        setCurrentAccDocData(doc);
      });
      history.replace({
        pathname: `/Accounts/${accountIds[count]}`,
        state: {
          accountData: res,
          accountIds: accountIds,
          accIndex: count,
          totalIndex: totalIndex,
        },
      });
      setLoad(false);
    });
  }

  async function handleDecrement() {
    setLoad(true);
    let count = curIndex - 1;
    await restApiRequest(token, true, accountIds[count]).then(async (res) => {
      setCurrentAccData(res);
      setCurIndex(count);
      await restApiGetUserDocuments(token, accountIds[count]).then((doc) => {
        setCurrentAccDocData(doc);
      });
      history.replace({
        pathname: `/Accounts/${accountIds[count]}`,
        state: {
          accountData: res,
          accountIds: accountIds,
          accIndex: count,
          totalIndex: totalIndex,
        },
      });
      setLoad(false);
    });
  }
  return (
    <div className="accounts-detail-container">
      <div>
        <Box sx={{ marginTop: "50px", marginBottom: "50px" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <div className="accounts-detail-title">
              {currentAccData.attributes.name}
            </div>
            <div className="accounts-detail-tabs">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="OVERVIEW" {...a11yProps(0)} />
                <Tab label="MORE INFORMATION" {...a11yProps(1)} />
                <Tab label="OTHER" {...a11yProps(2)} />
              </Tabs>
              <div className="change-account-detail">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleDecrement}
                  disabled={curIndex + 1 === 1 || load}
                >
                  <NavigateBeforeIcon /> Previous
                </Button>
                &nbsp; ({curIndex + 1} of {totalIndex})&nbsp;&nbsp;&nbsp;
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleIncrement}
                  disabled={curIndex + 1 === totalIndex || load}
                >
                  Next <NavigateNextIcon />
                </Button>
              </div>
            </div>
          </Box>
          <TabPanel
            style={{ background: "white", borderRadius: "0px 0px 4px 4px" }}
            value={value}
            index={0}
          >
            <Overview accountData={currentAccData} />
          </TabPanel>
          <TabPanel
            style={{ background: "white", borderRadius: "0px 0px 4px 4px" }}
            value={value}
            index={1}
          >
            <MoreInfo accountData={currentAccData} />
          </TabPanel>
          <TabPanel
            style={{ background: "white", borderRadius: "0px 0px 4px 4px" }}
            value={value}
            index={2}
          >
            <OtherInfo accountData={currentAccData} />
          </TabPanel>
        </Box>
        <Documents token={token} DocumentsData={currentAccDocData} />
        {load && (
          <div className="mt-2">
            <LoadingComponent />
          </div>
        )}
      </div>
    </div>
  );
}
