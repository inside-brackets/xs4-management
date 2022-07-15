import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import SingleMonth from "./SingleMonth";

const Report = ({ report }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const combinedArray = months.map((item, index) => {
    return {
      month: item,
      awarded: report.awardedSummary[index],
      cashRecieved: report.cashRecievedSummary[index],
    };
  });
  return (
    <Card>
      <Row className="m-2">
        <Col md={4}>
          <Row
            style={{
              backgroundColor: "#222B35",
              color: "#7193B0",
            }}
            className="pb-2"
          >
            <Col className="pt-3 " m={9}>
              <h5> {report.profile} </h5>
            </Col>
            <Col md={3} className="text-center">
              <h5 className="mt-3"> Total </h5>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col className="pt-3 " md={9}>
              <h5> Project Awarded During Month </h5>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={3}
              className="text-center"
            >
              <h5> {report.awardedTotal} </h5>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col className="pt-3 " m={9}>
              <h5> Cash Recieved During Month </h5>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={3}
              className="text-center"
            >
              <h5> {report.cashRecievedTotal} </h5>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col className="pt-3" m={9}>
              <h5> Current Pending Projects </h5>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={3}
              className="text-center"
            >
              <h5> {report.pendingTotal} </h5>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col className="pt-3 " m={9}>
              {" "}
              <h5> Total Cancelled Projects </h5>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={3}
              className="text-center"
            >
              <h5> {report.cancelledTotal} </h5>
            </Col>
          </Row>
          <hr className="m-0" />
        </Col>
        <Col md={8}>
          <Row>
            {combinedArray.map((item, index) => {
              return <SingleMonth key={index} item={item} />;
            })}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Report;
