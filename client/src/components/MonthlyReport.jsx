import React from "react";
import { Row, Col } from "react-bootstrap";
const MonthlyReport = ({ report, months, currMonth }) => {
  const combinedArray = months.map((item, index) => {
    return {
      month: item,
      closed: report.closedSummary[index],
      cashRecieved: report.cashRecievedSummary[index],
      empShare: report.empShareSummary[index],
    };
  });
const ans = combinedArray.find((item)=> item.month === currMonth)
  return (
    <Row className="mt-3">
      <Col><h6> {report.profile}</h6></Col>
      <Col className="text-center">{ans.cashRecieved}</Col>
      <Col className="text-center">{ans.empShare}</Col>
      <Col className="text-center">{ans.closed}</Col>
      <Col className="text-center">{report.pendingTotal}</Col>
      <Col className="text-center">{report.cancelledTotal}</Col>
    </Row>
  );
};

export default MonthlyReport;
