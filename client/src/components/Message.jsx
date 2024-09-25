import { Alert } from "react-bootstrap";
import React from "react";

const Message = ({ variant = "danger", children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
