import React from "react";
import { Row, Col } from "react-bootstrap";
import { formatter } from "../util/currencyFormatter";

const SingleMonth = ({ item }) => {
  return (
    <div style={{ width: "fit-content" }} className="mx-3">
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
          <p>
            {item.cashRecieved ? formatter("PKR").format(item.cashRecieved) : 0}
          </p>
        </Col>
      </Row>
      <Row className="mt-2 ">
        <Col className="text-center">
          <p>{item.empShare ? formatter("PKR").format(item.empShare) : 0}</p>
        </Col>
      </Row>
    </div>
  );
};

export default SingleMonth;
