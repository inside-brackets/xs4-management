import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import axios from "axios";
import ReactSelect from "react-select";
import { useParams } from "react-router-dom";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";

const AddProject = () => {
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({
    hasRecruiter: false,
    totalAmount: 0,
    netRecieveable: 0,
    status: "new",
  });
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignee, setAssignee] = useState([]);
  const [empShare, setEmpShare] = useState(0);

  const history = useHistory();

  const [loading, setLoading] = useState(false);

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
      setState((prev) => {
        return {
          ...prev,
          hasRecruiter: !state.hasRecruiter,
        };
      });
    } else {
      setState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  console.log(state);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/projects/${id}`)
        .then((res) => {
          const tempProfile = res.data;
          setSelectedProfile(res.data.profile);
          tempProfile.profile = tempProfile.profile._id;
          setState((prev) => ({ ...prev, ...res.data }));
          setLoading(false);
        });
    }
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/profiles/100/0`)
      .then((res) => {
        setProfiles(res.data.data);
      });
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
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    state.assignee = assignee.map((item) => item.value);
    console.log(state);

    if (id) {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
        state
      );
      if (res.status === 200) toast.success("Project Updated Successfully");
    } else {
      state.netRecieveable = state.totalAmount - amountDeducted();
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/projects/`,
        state
      );
      if (res.status === 201) {
        toast.success("Project Created Successfully");
        history.push("/projects");
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
    return Math.round(amtDec * 100) / 100;
  };

  useEffect(() => {
    let share = selectedProfile ? selectedProfile.share / 100 : 0;

    if (state.status === "closed") setEmpShare(share * state.totalAmount);
    else setEmpShare(0);
  }, [state.status]);

  const changeAssignee = (value) => {
    if (value.length !== 0 && state.status === "new") {
      setState((prev) => ({ ...prev, status: "open" }));
    }
    setAssignee(value);
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
                  value={state.title}
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
                  value={state.profile ?? ""}
                  required
                >
                  <option key="initial" value="">
                    Select-Profile
                  </option>
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
                    state.assignee
                      ? state.assignee.map((item) => {
                          return { value: item._id, label: item.userName };
                        })
                      : []
                  }
                  isMulti
                  name="assignee"
                  options={users}
                  onChange={changeAssignee}
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
                  value={state.clientName}
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
                  value={state.projectType ?? ""}
                  required
                >
                  <option key="initial" value="">
                    Select Project Type
                  </option>
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
                  Status
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
                  value={state.status}
                  required
                >
                  {assignee?.length === 0 && <option value="new">New</option>}
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
                  name="hasRecruiter"
                  checked={state.hasRecruiter}
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
                    value={state.recruiterName}
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
                  value={state.totalAmount}
                  onChange={handleChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Amount Deducted</Form.Label>
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
                  readOnly
                  value={empShare}
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
                  value={moment(state.awardedAt).format("YYYY-MM-DD")}
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
                  value={
                    state.closedAt &&
                    moment(state.closedAt).format("YYYY-MM-DD")
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
                  value={
                    state.deadlineAt &&
                    moment(state.deadlineAt).format("YYYY-MM-DD")
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
        <Button className="m-3" variant="success" md={4} type="submit">
          {id ? "Update" : "Create"}
        </Button>
      </Form>
      <ToastContainer />
    </Card>
  );
};

export default AddProject;
