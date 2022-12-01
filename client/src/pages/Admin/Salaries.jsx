import React from "react";
import { Button, Col, Row, Card, Badge } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";

import Table from "../../components/table/SmartTable";

const Salaries = () => {
  const history = useHistory();

  const generateSalary = (id) => {
    history.push("/salary/" + id);
  };

  const customerTableHead = [
    "#",
    "User Name",
    "Phone",
    "Email",
    "Department",
    "Base Salary",
    "Last Paid",
    "",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        {item.userName} {item.isManager && <Badge bg="primary">Manager</Badge>}
      </td>
      <td>{item.contact ? item.contact : "NA"}</td>
      <td>{item.email ? item.email : "NA"}</td>
      <td>{item.department}</td>
      <td>{item.salary}</td>
      <td>{item.lastPaid ? moment(item.lastSalary).format("MMMM") : "N/A"}</td>
      <td>
        <Button
          type="view"
          variant={item.lastPaid ? "success" : "primary"}
          className="w-80"
          onClick={() => generateSalary(item._id)}
        >
          {item.lastPaid ? "View" : "Generate"}
        </Button>
      </td>
    </tr>
  );

  return (
    <Row>
      <Col>
        <Card>
          <Card.Body>
            <Table
              limit={10}
              headData={customerTableHead}
              renderHead={(item, index) => renderHead(item, index)}
              api={{
                url: `${process.env.REACT_APP_BACKEND_URL}/salary/all`,
              }}
              placeholder={"User Name"}
              filter={{
                department: [
                  { label: "Accounts", value: "accounts" },
                  { label: "Graphics", value: "graphics" },
                ],
              }}
              renderBody={(item, index) => renderBody(item, index)}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Salaries;
