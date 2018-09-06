import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

/*
const localStyles = {
  className1: {
    ...
  },
  className2: {
    ...
  },
};
*/

class FabButton extends React.Component {
  constructor(props) {
    super(props);
    //this.handleEvent = this.handleEvent.bind(this);
    this.state = {};
  }

  componentDidMount() {
    //window.addEventListener("event", this.handleEvent);
  }

  componentWillUnmount() {
    //window.removeEventListener("event", this.handleEvent);
  }

  /*
  handleEvent(event) {
    ...
  }
  */

  render() {
    const { classes } = this.props;
    //const { someState } = this.state;

    return (
      <Tooltip title={this.props.title} placement="left">
        <Button
          variant="fab"
          color="primary"
          aria-label={this.props.title}
          onClick={this.props.onClick}
          disabled={this.props.disabled}
          style={this.props.backgroundColor}
        >
          {this.props.children}
        </Button>
      </Tooltip>
    );
  }
}

FabButton.propTypes = {
  classes: PropTypes.object.isRequired
};

FabButton.defaultProps = {
  title: "",
  onClick: null,
  disabled: false,
  backgroundColor: {}
};

/*
TemplateComponent.staticStyles = {
  ...
};
*/

export default FabButton;
