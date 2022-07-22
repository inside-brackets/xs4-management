import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import SingleMonth from "./SingleMonth";

const Report = ({ report, months }) => {
  const combinedArray = months.map((item, index) => {
    return {
      month: item,
      closed: report.closedSummary[index],
      cashRecieved: report.cashRecievedSummary[index],
      empShare: report.empShareSummary[index],
    };
  });
  return (
    <Card>
      <Row className="m-0">
        <Col md={3}>
          <Row
            style={{
              backgroundColor: "#222B35",
              color: "#7193B0",
            }}
            className="pb-2"
          >
            <Col className="pt-3 " m={7}>
              <p> {report.profile} </p>
            </Col>
            <Col md={5} className="text-center">
              <p className="mt-3"> Total </p>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col md={7}>
              <p>Projects Closed</p>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={5}
              className="text-center"
            >
              <p> {report.closedTotal} </p>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col m={7}>
              <p>Cash Recieved</p>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={5}
              className="text-center"
            >
              <p>{report.cashRecievedTotal}</p>
              {/* <p>{formatter("PKR").format(10000000)}</p> */}
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col m={7}>
              <p>Employee Share</p>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={5}
              className="text-center"
            >
              <p>{report.empShareTotal}</p>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col m={9}>
              <p>Projects Pending</p>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={5}
              className="text-center"
            >
              <p> {report.pendingTotal} </p>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col m={7}>
              <p>Projects Cancelled</p>
            </Col>
            <Col
              style={{
                backgroundColor: "#222B35",
                color: "#7193B0",
              }}
              md={5}
              className="text-center"
            >
              <p> {report.cancelledTotal} </p>
            </Col>
          </Row>
        </Col>
        <Col md={9}>
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
