import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactSelect from "react-select";
import { useParams } from "react-router-dom";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";

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
  const [assignee, setAssignee] = useState([]);
  const userRegister = useSelector((state) => state.userRegister);
  const [defaultValue, setDefaultValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const { error } = userRegister;
  const { id } = useParams();
  const handleChange = (evt) => {
    console.log(evt);
    const value = evt.target.value;
    const name = evt.target.name;
    console.log("name value", name, value);
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
    if (id) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/projects/${id}`)
        .then((res) => {
          setDefaultValue(res.data);
          setState(pre=> ({...pre,totalAmount: res.data.totalAmount,hasRecruiter:res.data.hasRecruiter }));
          setLoading(false);
        });
    }
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
  }, [profiles.length, users.length,id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === true) {
      if (defaultValue) {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/projects/${defaultValue._id}`,
          state
        );
        if(res.status === 200) toast.success("Project Updated Successfully")
      } else {
        if (!state.status) {
          state.status = assignee.length > 0 ? "open" : "new";
        }
        state.netRecieveable = state.totalAmount - amountDeducted();
        state.assignee = assignee.map((item) => item.value);
       const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/projects/`,
          state
        );

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
    let platformFee = selectedProfile ? selectedProfile.platformFee / 100 : 0.1;
    let recruiterFee = 0.05;
    if (state.hasRecruiter) {
      if (state.status === "closed") {
        amtDec = (platformFee + recruiterFee) * state.totalAmount;
      } else {
        amtDec = 0;
      }
    } else {
      amtDec = platformFee * state.totalAmount;
    }
    return amtDec;
  };

  const employeeShare = () => {
    let share = selectedProfile ? selectedProfile.share / 100 : 0;
    if (state.status === "closed") return share * state.totalAmount;
  };
  return (
    <Card>
      {" "}
      <Card.Title className="text-center">
        <h1>Project Detail</h1>
      </Card.Title>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {loading ? (
          <div>Loading....</div>
        ) : (
          <Row className="my-2 mx-3">
            <Row className="my-2">
              {" "}
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Title{" "}
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  name="title"
                  onChange={handleChange}
                  type="text"
                  defaultValue={defaultValue && defaultValue.title}
                  placeholder="Enter title"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Profile{" "}
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="profile"
                  onChange={handleChange}
                  required
                >
                  {defaultValue ? (
                    <option value={defaultValue.profile._id}>
                      {defaultValue.profile.title}
                    </option>
                  ) : (
                    <option key={"initial"} value="">
                      Select-Profile
                    </option>
                  )}
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
                  defaultValue={
                    defaultValue &&
                    defaultValue.assignee.map((item) => {
                      return { value: item._id, label: item.userName };
                    })
                  }
                  isMulti
                  name="assignee"
                  options={users}
                  onChange={setAssignee}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} md="4">
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={defaultValue && defaultValue.clientName}
                  placeholder="Client Name"
                  name="clientName"
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Project Type{" "}
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="projectType"
                  onChange={handleChange}
                  required
                >
                  {defaultValue ? (
                    <option value={defaultValue.projectType}>
                      {defaultValue.projectType}
                    </option>
                  ) : (
                    <option key="initial" value="">
                      Select Project Type
                    </option>
                  )}
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
                <Form.Label>
                  Status{" "}
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  onChange={handleChange}
                  defaultValue={
                    defaultValue
                      ? defaultValue.status
                      : assignee.length > 0
                      ? "open"
                      : "new"
                  }
                  required
                >
                  {assignee.length < 1 && <option value="new">New</option>}
                  <option value="open">Open</option>
                  <option value="underreview">Underreview</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="closed">Closed</option>
                </Form.Control>

                <Form.Control.Feedback type="invalid">
                  Please provide a valid Role.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mt-3 ml-3 align-items-center">
              <Form.Group className="mt-4" as={Col} md="2">
                <Form.Check
                  type="checkbox"
                  // id={`default-${type}`}
                  name="hasRecruiter"
                  defaultChecked={defaultValue && defaultValue.hasRecruiter}
                  label={`Has Recruiter`}
                  onChange={handleChange}
                />
              </Form.Group>
              {state.hasRecruiter && (
                <Form.Group as={Col} md="4">
                  <Form.Label>Recruiter Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Recruiter Name"
                    name="recruiterName"
                    onChange={handleChange}
                    defaultValue={defaultValue && defaultValue.recruiterName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                  </Form.Control.Feedback>
                </Form.Group>
              )}
            </Row>
            <hr className="my-5" />
            <Row className="my-2">
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Total Amount{" "}
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Total Amount"
                  name="totalAmount"
                  defaultValue={defaultValue && defaultValue.totalAmount}
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
                  readOnly
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
            </Row>
            <Row>
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
              <Form.Group as={Col} md="4">
                <Form.Label>Employee Share</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Employee Share"
                  // onChange={handleChange}
                  readOnly
                  value={employeeShare()}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <br />
            <hr className="my-5" />
            <Row className="my-2">
              <Form.Group as={Col} md="4">
                <Form.Label>Awarded At</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Awarded At"
                  defaultValue={
                    defaultValue &&
                    moment(defaultValue.awardedAt).format("YYYY-MM-DD")
                  }
                  name="awardedAt"
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Closed At</Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={
                    defaultValue &&
                    defaultValue.closedAt &&
                    moment(defaultValue.closedAt).format("YYYY-MM-DD")
                  }
                  placeholder="Closed At"
                  name="closedAt"
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Deadline At</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Deadline At"
                  defaultValue={
                    defaultValue &&
                    defaultValue.deadlineAt &&
                    moment(defaultValue.deadlineAt).format("YYYY-MM-DD")
                  }
                  name="deadlineAt"
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Row>
        )}
        <Button className="p-2 m-3" variant="success" md={3} type="submit">
          Submit
        </Button>
      </Form>
      <ToastContainer />
    </Card>
  );
};

export default AddProject;
