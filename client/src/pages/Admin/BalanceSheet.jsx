import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Spinner } from "react-bootstrap";
import axios from "axios";

import "../../components/BalanceSheet/BalanceSheet.css";
import Expenses from "../../components/BalanceSheet/Expenses";
import Overview from "../../components/BalanceSheet/Overview";
import Projects from "../../components/BalanceSheet/Projects";
import Revenues from "../../components/BalanceSheet/Revenues";

const getYears = () => {
  const YEAR = new Date().getFullYear();
  const STARTING_YEAR = 2022;
  const years = Array.from(
    new Array(YEAR - STARTING_YEAR + 1),
    (val, index) => index + STARTING_YEAR
  );
  return years;
};

const MONTHS = [
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

function BalanceSheet() {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    fetchBalanceSheet(month, year);
  }, [month, year]);

  const fetchBalanceSheet = async (m, y) => {
    if (!isNaN(m) && !isNaN(y)) {
      await axios
        .request({
          method: "GET",
          url: `http://localhost:5000/balance/${y}/${m}`,
        })
        .then(({ data }) => {
          setBalanceSheet(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return !balanceSheet ? (
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
    <>
      <div className="flex-row flex-center">
        <Form.Group className="my-2 pad-r1">
          <Form.Label>Year</Form.Label>
          <Form.Select
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="min-200"
          >
            {getYears().map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="my-2">
          <Form.Label>Month</Form.Label>
          <Form.Select
            required
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="min-200"
          >
            {MONTHS.map((y, i) => (
              <option key={i} value={i}>
                {y}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      <Card>
        <div className="fix-card">
          <Overview data={balanceSheet} />
          <hr className="h-line pad-b1" />
          <Revenues data={balanceSheet} />
          <Expenses data={balanceSheet} />
          <Projects data={balanceSheet.clearedProjects} />
        </div>
      </Card>
    </>
  );
}

export default BalanceSheet;
