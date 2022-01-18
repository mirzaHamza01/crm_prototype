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

export default function MoreInfo({ accountData }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16} className="overview-grid">
        <Grid item className="display-grid" xs={8}>
          <Grid>
            <div>Type:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.account_type}</Item>
          </Grid>
        </Grid>
        <Grid className="display-grid" item xs={8}>
          <Grid>
            <div>Industry:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.industry}</Item>
          </Grid>
        </Grid>
        <Grid item className="display-grid" xs={8}>
          <Grid>
            <div>Annual Revenue:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.annual_revenue}</Item>
          </Grid>
        </Grid>
        <Grid className="display-grid" item xs={8}>
          <Grid>
            <div>Employees:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.employees}</Item>
          </Grid>
        </Grid>
        <Grid item className="display-grid" xs={16}>
          <Grid>
            <div>Member of:</div>
          </Grid>
          <Grid xs={14}>
            <Item>{""}</Item>
          </Grid>
        </Grid>
        <Grid item className="display-grid" xs={16}>
          <Grid>
            <div>Campaign:</div>
          </Grid>
          <Grid xs={14}>
            <Item>{accountData.attributes.campaign_name}</Item>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
