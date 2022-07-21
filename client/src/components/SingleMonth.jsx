import React from "react";
import { Row, Col } from "react-bootstrap";

const SingleMonth = ({ item }) => {
  return (
    <Col md={1}>
      <Row className="mb-2 ">
        <Col className="text-center">
          <p
            className="mt-3"
            style={{
              color: "#849AB8",
              fontWeight: "bold",
            }}
          >
            {item.month}
          </p>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <p>{item.closed}</p>
        </Col>
      </Row>
      <Row className="mt-2 ">
        <Col className="text-center">
          <p>{item.cashRecieved}</p>
        </Col>
      </Row>
      <Row className="mt-2 ">
        <Col className="text-center">
          <p>{item.empShare}</p>
        </Col>
      </Row>
    </Col>
  );
};

export default SingleMonth;
