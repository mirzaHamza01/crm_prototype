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

export default function Overview({ accountData }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16} className="overview-grid">
        <Grid item className="display-grid" xs={8}>
          <Grid>
            <div>Name:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.name}</Item>
          </Grid>
        </Grid>
        <Grid className="display-grid" item xs={8}>
          <Grid>
            <div>Office Phone:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.phone_office}</Item>
          </Grid>
        </Grid>
        <Grid item className="display-grid" xs={8}>
          <Grid>
            <div>Website:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.website}</Item>
          </Grid>
        </Grid>
        <Grid className="display-grid" item xs={8}>
          <Grid>
            <div>Fax:</div>
          </Grid>
          <Grid xs={12}>
            <Item>{accountData.attributes.phone_fax}</Item>
          </Grid>
        </Grid>
        <Grid item className="display-grid" xs={16}>
          <Grid>
            <div>Email Address:</div>
          </Grid>
          <Grid xs={14}>
            <Item>{accountData.attributes.email}</Item>
          </Grid>
        </Grid>
        <Grid item className="display-grid" xs={8}>
          <Grid>
            <div>Billing Address:</div>
          </Grid>
          <Grid xs={12}>
            <Item>
              {" "}
              {accountData.attributes.billing_address_street} &nbsp;{" "}
              {accountData.attributes.billing_address_state}
              &nbsp;
              {accountData.attributes.billing_address_country}&nbsp;{" "}
              {accountData.attributes.billing_address_postalcode}
            </Item>
          </Grid>
        </Grid>
        <Grid className="display-grid" item xs={8}>
          <Grid>
            <div>Shipping Address:</div>
          </Grid>
          <Grid xs={12}>
            <Item>
              {accountData.attributes.shipping_address_street} &nbsp;{" "}
              {accountData.attributes.shipping_address_state}&nbsp;
              {accountData.attributes.shipping_address_country}&nbsp;{" "}
              {accountData.attributes.shipping_address_postalcode}
            </Item>
          </Grid>
        </Grid>
        <Grid item className="display-grid" xs={16}>
          <Grid>
            <div>Description:</div>
          </Grid>
          <Grid xs={14}>
            <Item>{accountData.attributes.description}</Item>
          </Grid>
        </Grid>
        <Grid item className="display-grid" xs={16}>
          <Grid>
            <div>Assigned to:</div>
          </Grid>
          <Grid xs={14}>
            <Item>{accountData.attributes.assigned_user_name}</Item>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
