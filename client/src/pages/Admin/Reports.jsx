import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Report from "../../components/Report";
const getYears = () => {
  const year = new Date().getFullYear();
  const STARTING_YEAR = 2022;
  const years = Array.from(
    new Array(year - STARTING_YEAR + 1),
    (val, index) => index + STARTING_YEAR
  );
  return years;
};

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const getReports = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reports/profiles_summary/${year}`
      );
      if (res.status === 200) {
        console.log(res.data);
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
      <Form.Group className="my-2" as={Col} md="1">
        <Form.Label>Year</Form.Label>
        <Form.Select required value={year} onChange={(e) => setYear(e.target.value)}>
          {getYears().map((y) => (
            <option value={y}>{y}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {reports.map((report) => (
        <Report report={report} />
      ))}
    </Row>
  );
};

export default Reports;
