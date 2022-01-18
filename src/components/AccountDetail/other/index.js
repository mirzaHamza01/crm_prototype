import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function OtherInfo({ accountData }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16} className="overview-grid">
        <Grid item className="display-grid" xs={8}>
          <Grid>
            <div>Date Created:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.date_entered}</Item>
          </Grid>
        </Grid>
        <Grid className="display-grid" item xs={8}>
          <Grid>
            <div>Date Modified:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.date_modified}</Item>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
