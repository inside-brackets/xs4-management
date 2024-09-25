import React, { useState, useEffect } from "react";
import { Button, Col, Row, Card, Badge } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Table from "../../components/table/SmartTable";

const TODAY = new Date();
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getYears = () => {
  const YEAR = new Date();
  if (YEAR.getMonth() === 0) {
    YEAR.setFullYear(YEAR.getFullYear() - 1);
  }
  const STARTING_YEAR = 2022;
  const years = Array.from(
    new Array(YEAR.getFullYear() - STARTING_YEAR + 1),
    (val, index) => index + STARTING_YEAR
  );
  return years;
};

const Salaries = () => {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [months, setMonths] = useState([]);
  const [refresh, setRefresh] = useState(null);

  const history = useHistory();

  useEffect(() => {
    if (TODAY.getMonth() === 0) {
      setYear(TODAY.getFullYear() - 1);
      setMonth(11);
    } else {
      setYear(TODAY.getFullYear());
      setMonth(TODAY.getMonth() - 1);
    }
  }, []);

  useEffect(() => {
    setRefresh(Math.random());
  }, [year, month]);

  useEffect(() => {
    generateArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const generateArray = async () => {
    if (year < TODAY.getFullYear()) {
      setMonths(MONTHS);
    } else {
      setMonths(MONTHS.slice(0, TODAY.getMonth()));
    }

    if (month >= TODAY.getMonth() && TODAY.getMonth() !== 0) {
      setMonth(TODAY.getMonth() - 1);
    }
  };

  const paySalary = async (id, base, incentive) => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/salary/create`,
      headers: { "Content-Type": "application/json" },
      data: {
        user: id,
        year: year,
        month: month,
        adjustment: [],
        incentive: incentive,
        base: base,
      },
    });
    setRefresh(Math.random());
    toast.success("Salary Paid!");
  };

  const customerTableHead = [
    "#",
    "User Name",
    "Department",
    "Base Salary",
    "Incentive",
    "Total",
    "Paid",
    "",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        {item.userName} {item.isManager && <Badge bg="primary">Manager</Badge>}
      </td>
      <td>{item.department}</td>
      <td>{item.salary}</td>
      <td>{item.incentive}</td>
      <td>{Number(item.salary) + Number(item.incentive)}</td>
      <td>{item.paid ? "Yes" : "No"}</td>
      <td align="right">
        <Dropdown as={ButtonGroup}>
          <Button
            variant={item.paid ? "primary" : "success"}
            className="w-unset w-80"
            onClick={() => {
              if (item.paid) {
                history.replace(`/salary/${year}/${month}/${item._id}`);
              } else {
                paySalary(item._id, item.salary, item.incentive);
              }
            }}
          >
            {item.paid ? "View" : "Pay"}
          </Button>
          <Dropdown.Toggle
            split
            variant={item.paid ? "primary" : "success"}
            className="w-unset"
          />
          <Dropdown.Menu>
            <Dropdown.Item href={`/salary/${year}/${month}/${item._id}`}>
              Add Adjustment
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );

  return (
    <>
      <Row className="mb-3">
        <Col md={3}>
          <label htmlFor="yearSelect" className="form-label">
            Year
          </label>
          <select
            name="yearSelect"
            id="yearSelect"
            value={year}
            className="form-select"
            onChange={(e) => setYear(e.target.value)}
          >
            {getYears().map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Col>
        <Col md={3}>
          <label htmlFor="monthSelect" className="form-label">
            Month
          </label>
          <select
            name="monthSelect"
            id="monthSelect"
            value={month}
            className="form-select"
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((y, i) => (
              <option key={i} value={i}>
                {y}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {year && month && (
                <Table
                  limit={10}
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  api={{
                    url: `${process.env.REACT_APP_BACKEND_URL}/salary/all/${year}/${month}`,
                  }}
                  placeholder={"User Name"}
                  filter={{
                    department: [
                      { label: "Accounts", value: "accounts" },
                      { label: "Graphics", value: "graphics" },
                    ],
                  }}
                  renderBody={(item, index) => renderBody(item, index)}
                  refresh={refresh}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Salaries;
