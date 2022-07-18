import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Report from "../../components/Report";

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
  }, []);

  return (
    <>
      {" "}
      {!reports ? (
        <div>loading</div>
      ) : (
        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label>Search</Form.Label>
            <input
              className="form-control"
              type="number"
              placeholder="2022"
              min="1900"
              max={new Date().getFullYear()}
              step="1"
              // defaultValue={dbUser?.email}
            />
          </Form.Group>
          {reports.map((report) => (
            <Report report={report} />
          ))}
        </Row>
      )}
    </>
  );
};

export default Reports;
