import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

import SalaryCard from "../../components/SalaryCard/SalaryCard";

function Salary() {
  const [user, setUser] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/users/` + id)
      .then(({ data }) => {
        setUser(data);
      });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/salary/last`,
      headers: { "Content-Type": "application/json" },
      data: {
        user: id,
      },
    }).then(({ data }) => {
      if (data) {
        setReadOnly(true);
      }
    });
  }, [id]);

  return (
    <Row>
      <Col>
        {user && (
          <SalaryCard
            user={user}
            readOnly={readOnly}
            setReadOnly={setReadOnly}
          />
        )}
      </Col>
    </Row>
  );
}

export default Salary;
