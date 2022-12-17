import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const OtherRevenue = ({ profile, defaultValue, onSuccess }) => {
  const [state, setState] = useState({});

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);

      return;
    }
    setLoading(true);

    if (!defaultValue) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/other_revenue`, state)
        .then((res) => {
          onSuccess();
          toast.success("Revenue Created Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          toast.error("Please fill out mandatory fields");
          setLoading(false);
        });
    } else {
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/other_revenue/${defaultValue._id}`,
          state
        )
        .then((res) => {
          onSuccess();
          toast.success("Revenue Updated Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.msg ?? err.response.statusText);
          setLoading(false);
        });
    }
  };

  return (
    <Row>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label>Client</Form.Label>
            <Form.Control
              name="client"
              type="text"
              placeholder="Client Name"
              onChange={handleChange}
              defaultValue={defaultValue ? defaultValue.client : null}
            />

            <Form.Label>Category</Form.Label>
            <Form.Select
              required
              name="category"
              defaultValue={defaultValue ? defaultValue.category : ""}
              onChange={handleChange}
            >
              <option value="">Select-Category</option>
              <option value="office">Office</option>
              <option value="profileMembership">Profile MemberShip</option>
            </Form.Select>

            <Form.Label>Amount</Form.Label>
            <Form.Control
              placeholder="Amount"
              required
              name="amount"
              min={0}
              defaultValue={defaultValue ? defaultValue.amount : null}
              onChange={handleChange}
              type="number"
            />
          </Form.Group>

          <Form.Group as={Col} md="6">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Date"
              defaultValue={
                defaultValue
                  ? moment(defaultValue.date).format("YYYY-MM-DD")
                  : Date.now()
              }
              name="date"
              onChange={handleChange}
              required
            />
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={4}
              aria-label="With textarea"
              type="text"
              placeholder="Description"
              onChange={handleChange}
              defaultValue={defaultValue ? defaultValue.description : null}
              name="description"
            />
          </Form.Group>

          <Row className="mt-3">
            <Col md="6">
              <Button disabled={loading} type="submit">
                {" "}
                {loading && (
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Submit
              </Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </Row>
  );
};

export default OtherRevenue;
