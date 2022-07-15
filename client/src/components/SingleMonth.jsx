import React from "react";
import { Row, Col } from "react-bootstrap";

const SingleMonth = ({ item }) => {
  return (
    <>
      <Col md={1}>
        <Row className="mb-2 ">
          <Col md={12} className="text-center">
            <h5
              className="mt-3"
              style={{
                color: "#849AB8",
              }}
            >
              {" "}
              {item.month}{" "}
            </h5>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-center">
            {" "}
            <h5>{item.awarded}</h5>
          </Col>
        </Row>
        <Row className="mt-3 ">
          <Col md={12} className="text-center">
            <h5> {item.cashRecieved}</h5>
          </Col>
        </Row>

      </Col>
    </>
  );
};

export default SingleMonth;
