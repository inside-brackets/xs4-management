import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner, Card } from "react-bootstrap";
import Report from "../../components/Report";
import MonthlyReport from "../../components/MonthlyReport";
const getYears = () => {
  const year = new Date().getFullYear();
  const STARTING_YEAR = 2022;
  const years = Array.from(
    new Array(year - STARTING_YEAR + 1),
    (val, index) => index + STARTING_YEAR
  );
  return years;
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const Reports = () => {
  const [reports, setReports] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  useEffect(() => {
    const getReports = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reports/profiles_summary/${year}`
      );
      if (res.status === 200) {
        setReports(res.data);
      }
    };
    getReports();
  }, [year]);

  return !reports ? (
    <Row className="d-flex align-items-center">
      <Col className="text-center">
        <Spinner
          animation="border"
          variant="primary"
          style={{
            height: "50px",
            width: "50px",
          }}
        />
      </Col>
    </Row>
  ) : (
    <Row>
      <Form.Group className="my-2" as={Col} md="2">
        <Form.Label>Year</Form.Label>
        <Form.Select
          required
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {getYears().map((y,i) => (
            <option key={i} value={y}>{y}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="my-2" as={Col} md="2">
        <Form.Label>Month</Form.Label>
        <Form.Select
          required
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Year-View</option>
          {months.map((y,i) => (
            <option key={i} value={y}>{y}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Card
        className={`scroll-container m-0 ${month ? "mt-2" : ""}`}
        style={{ maxHeight: "70vh" }}
      >
        {month && (
          <>
            <Row
              style={{
                color: "#849AB8",
                fontWeight: "bold",
              }}
            >
              <Col md={2} className="text-center">Profile Title</Col>
              <Col md={2} className="text-center">Cash Recieved</Col>
              <Col md={2} className="text-center">Employee Share</Col>
              <Col md={2} className="text-center">Projects Closed</Col>
              <Col md={2} className="text-center">Current Pending</Col>
              <Col md={2} className="text-center">Total Cancelled</Col>
            </Row>
            <hr />
          </>
        )}
        {reports.map((report,index) => {
          if (month) {
            return (
              <MonthlyReport
              key={index}
                report={report}
                months={months}
                currMonth={month}
              />
            );
          } else {
            return <Report key={index} report={report} months={months} />;
          }
        })}
      </Card>
    </Row>
  );
};

export default Reports;
