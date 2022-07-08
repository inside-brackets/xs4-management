import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";

import { Register } from "../../store/Actions/userAction";

const AddProject = ({ setShowModal }) => {
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({
    hasRecruiter: false,
    totalAmount: 0,
    netRecieveable: 0,
  });
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const animatedComponents = makeAnimated();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error } = userRegister;

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    if (name === "profile") {
      setSelectedProfile(profiles.find((pro) => pro._id === value));
    }
    if (name === "hasRecruiter") {
      setState({
        ...state,
        hasRecruiter: !state.hasRecruiter,
      });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    if (profiles.length === 0) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/profiles/100/0`)
        .then((res) => {
          setProfiles(res.data.data);
        });
    }
    if (users.length === 0) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/users/100/0`)
        .then((res) => {
          setUsers(
            res.data.data.map((user) => {
              return {
                value: user._id,
                label: user.userName,
              };
            })
          );
        });
    }
  }, [profiles.length, users.length]);

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
  const amountRecieved = () => {
    let amountRec = 0;
    if (state.status === "open") {
      amountRec = 0;
    } else if (state.status === "closed") {
      if (state.hasRecruiter) {
        amountRec = state.totalAmount * 0.85;
      } else {
        amountRec = state.totalAmount - amountDeducted();
      }
    }
    return amountRec;
  };

  const amountDeducted = () => {
    let amtDec;
    if (state.hasRecruiter) {
      if (state.status === "closed") {
        amtDec = 0.15 * state.totalAmount;
      } else {
        amtDec = 0;
      }
    } else {
      amtDec = 0.1 * state.totalAmount;
    }
    return amtDec;
  };
  // net recieveable = tm - ad
  // emp share = amount_recieved*profile.share
  return (
    <Card>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="my-2">
          <Form.Group as={Col} md="4">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              onChange={handleChange}
              type="text"
              placeholder="Enter title"
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Profile</Form.Label>
            <Form.Control
              as="select"
              name="profile"
              onChange={handleChange}
              required
            >
              <option value={null}>Select-Profile</option>
              {profiles.map((profile, index) => {
                return (
                  <option key={index} value={profile._id}>
                    {profile.title}
                  </option>
                );
              })}
            </Form.Control>

            <Form.Control.Feedback type="invalid">
              Please provide a valid Role.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="4">
            <Form.Label>Assignee</Form.Label>
            <ReactSelect
              name="assignee"
              components={animatedComponents}
              isMulti
              onChange={handleChange}
              options={users}
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
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
          <Form.Group as={Col} md="4">
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

          <Form.Group as={Col} md="4">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              onChange={handleChange}
              defaultValue="new"
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
          <Row className="mt-3 ml-3 align-items-center">
            <Form.Group className="mt-4" as={Col} md="2">
              <Form.Check
                type="checkbox"
                // id={`default-${type}`}
                name="hasRecruiter"
                label={`Has Recruiter`}
                onChange={handleChange}
              />
            </Form.Group>
            {state.hasRecruiter && (
              <Form.Group as={Col} md="4">
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
          <br />
          <hr />
          <br />
          <Form.Group as={Col} md="4">
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
          <Form.Group as={Col} md="4">
            <Form.Label>Amount Deductable</Form.Label>
            <Form.Control
              type="number"
              placeholder="Total Amount"
              name="amountDeducted"
              onChange={handleChange}
              value={amountDeducted()}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Net Recieveable</Form.Label>
            <Form.Control
              type="number"
              placeholder="Net Recieveable"
              readOnly
              value={state.totalAmount - amountDeducted()}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Amount Recieved</Form.Label>
            <Form.Control
              type="number"
              placeholder="Amount Recieved"
              onChange={handleChange}
              value={amountRecieved()}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <br />
          <hr />
          <Form.Group as={Col} md="6">
            <Form.Label>Awarded At</Form.Label>
            <Form.Control
              type="date"
              placeholder="Awarded At"
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
              placeholder="Closed At"
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
              placeholder="Deadline At"
              name="deadlineAt"
              onChange={handleChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Button type="submit">Submit</Button>
      </Form>
    </Card>
  );
};

export default AddProject;
