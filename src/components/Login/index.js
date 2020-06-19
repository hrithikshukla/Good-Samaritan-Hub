import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  topCentre: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  marginBottom: {
    marginBottom: "20px",
  },
  loginButton: {
    marginTop: "20px",
  },
}));

export default function Login() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Box className={classes.topCentre}>
        <div>
          <TextField
            className={classes.marginBottom}
            label="Username"
            variant="outlined"
          />
        </div>
        <div>
          <TextField label="Password" variant="outlined" />
          <Link className="link" to={"/registration"}>
            Need to register?
          </Link>
        </div>
        <div>
          <Button
            className={classes.loginButton}
            variant="contained"
            color="primary"
          >
            LOG IN
          </Button>
        </div>
      </Box>
    </form>
  );
}
