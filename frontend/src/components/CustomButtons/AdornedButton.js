import React from "react";
// import Button from '@material-ui/core/Button'
import Button from "./Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    marginLeft: 10,
  },
};
const SpinnerAdornment = withStyles(styles)((props) => (
  <CircularProgress className={props.classes.spinner} size={20} />
));

const AdornedButton = (props) => {
  const { children, loading, ...rest } = props;
  return (
    <Button {...rest}>
      {children}
      <div style={{ marginLeft: "10px" }}>
        {loading && <SpinnerAdornment {...rest} />}
      </div>
    </Button>
  );
};

export default AdornedButton;
