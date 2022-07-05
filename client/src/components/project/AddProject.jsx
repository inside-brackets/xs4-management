import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

import { Register } from "../../store/Actions/userAction";

const AddProject = ({ setShowModal }) => {
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({});
  const [usernameIsValid, setUsernameIsValid] = useState(null);
  const [hasRecruiter, setHasRecruiter] = useState(false);
  const animatedComponents = makeAnimated();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error } = userRegister;

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  useEffect(() => {
    if (state.userName) {
      const indentifier = setTimeout(async () => {
        let userName = state.userName.replace(/\s+/g, " ").trim().toLowerCase();
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/users/10/0`,
          { search: userName }
        );
        setUsernameIsValid(response.data.length === 0);
      }, 500);
      return () => {
        clearTimeout(indentifier);
      };
    }
  }, [state.userName]);

  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      dispatch(Register(state));
      if (!loading && !error) {
        setShowModal();
      }
    }
  };

  const projectTypeOptions = [
    "BP",
    "FM",
    "PD",
    "BP + FM",
    "BP + PD",
    "FM + PD",
    "BP + FM + PD",
    "legal contract",
    "assignment",
    "company profile",
    "presentation",
    "other graphics",
    "SOP + Policies",
    "bookkeeping",
    "excel tamplets",
    "market research",
    "market plan",
    "proposal",
  ];

  return (
    <Card>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="my-2">
          <Form.Group as={Col} md="6">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              onChange={handleChange}
              type="text"
              placeholder="Enter title"
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Profile</Form.Label>
            <Form.Control
              as="select"
              name="profile"
              onChange={handleChange}
              required
            >
              <option value={null}></option>
            </Form.Control>

            <Form.Control.Feedback type="invalid">
              Please provide a valid Role.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Assignee</Form.Label>
            <ReactSelect name="assignee" components={animatedComponents} isMulti />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Client Name"
              name="clientName"
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Project Type</Form.Label>
            <Form.Control
              as="select"
              name="projectType"
              onChange={handleChange}
              required
            >
              <option value={null}>Select Project Type</option>
              {projectTypeOptions.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </Form.Control>

            <Form.Control.Feedback type="invalid">
              Please provide a valid Role.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              onChange={handleChange}
              required
            >
              {["new", "open", "underreview", "cancelled", "closed"].map(
                (item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                )
              )}
            </Form.Control>

            <Form.Control.Feedback type="invalid">
              Please provide a valid Role.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Total Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Total Amount"
              name="totalAmount"
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Amount Deductable</Form.Label>
            <Form.Control
              type="number"
              placeholder="Total Amount"
              name="totalAmount"
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Net Recieveable</Form.Label>
            <Form.Control
              type="number"
              placeholder="Total Amount"
              name="totalAmount"
            //   onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Amount Recieved</Form.Label>
            <Form.Control
              type="number"
              placeholder="Total Amount"
              name="amountRecieved"
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Awarded At</Form.Label>
            <Form.Control
              type="date"
              placeholder="Total Amount"
              name="awardedAt"
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Closed At</Form.Label>
            <Form.Control
              type="date"
              placeholder="Total Amount"
              name="closedAt"
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Deadline At</Form.Label>
            <Form.Control
              type="date"
              placeholder="Total Amount"
              name="deadlineAt"
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="mt-3 ml-3 align-items-center">
            <Form.Group as={Col} md="6">
              <Form.Check
                type="checkbox"
                // id={`default-${type}`}
                label={`Has Recruiter`}
                onChange={() => setHasRecruiter(!hasRecruiter)}
              />
            </Form.Group>
            {hasRecruiter && (
              <Form.Group as={Col} md="6">
                <Form.Label>Recruiter Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Client Name"
                  name="recruiterName"
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Row>
        </Row>
        <Button type="submit">Submit</Button>
      </Form>
    </Card>
  );
};

export default AddProject;
