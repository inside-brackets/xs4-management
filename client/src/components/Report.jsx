import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import SingleMonth from "./SingleMonth";
import { formatter } from "../util/currencyFormatter";

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
      <div className="m-0 d-flex flex-row">
        <Col md={4}>
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
              <p>Paid Milestones</p>
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
              <p>{formatter("PKR").format(report.cashRecievedTotal)}</p>
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
              <p>{formatter("PKR").format(report.empShareTotal)}</p>
            </Col>
          </Row>
          <hr className="m-0" />
          <Row>
            <Col m={9}>
              <p>Unpaid Milestones</p>
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
              <p>Cancelled Milestones</p>
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
        <div className="d-flex flex-row x-scroll hide-scrollbar w-100">
          {combinedArray.map((item, index) => {
            return <SingleMonth key={index} item={item} />;
          })}
        </div>
      </div>
    </Card>
  );
};

export default Report;
