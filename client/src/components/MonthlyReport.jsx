import React from "react";
import { Row, Col } from "react-bootstrap";
import { formatter } from "../util/currencyFormatter";
const MonthlyReport = ({ report, months, currMonth }) => {
  const combinedArray = months.map((item, index) => {
    return {
      month: item,
      closed: report.closedSummary[index],
      cashRecieved: report.cashRecievedSummary[index],
      empShare: report.empShareSummary[index],
    };
  });
  const ans = combinedArray.find((item) => item.month === currMonth);
  return (
    <Row className="mt-3">
      <Col md={2}>
        <h6> {report.profile}</h6>
      </Col>
      <Col className="text-center">
        {ans?.cashRecieved ? formatter("PKR").format(ans?.cashRecieved) : 0}
      </Col>
      <Col className="text-center">
        {ans?.empShare ? formatter("PKR").format(ans.empShare) : 0}
      </Col>
      <Col className="text-center">{ans?.closed}</Col>
      <Col className="text-center">{report?.pendingTotal}</Col>
      <Col className="text-center">{report?.cancelledTotal}</Col>
    </Row>
  );
};

export default MonthlyReport;
