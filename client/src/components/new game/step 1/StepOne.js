import React from "react";
import EmailInvite from "./EmailInvite";
import LinkInvite from "./LinkInvite";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Grid, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  inviteSection: {
    margin: "2rem",
  },
}));

const StepOne = (props) => {
  const classes = useStyles();

  return (
    <>
      <Box mt={5} minHeight={170}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          className={classes.inviteSection}
        >
          <Grid item xs={7}>
            <EmailInvite />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs>
            <LinkInvite />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default StepOne;
