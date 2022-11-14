import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import ReactSelect from "react-select";
import { useParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Milestone from "./AddMilestone";
import ShowMilestone from "./ShowMilestone";
import MyModal from "../modals/MyModal";

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
var currency_list = [
  { name: "USD", code: "USD" },
  { name: "AUD", code: "AUD" },
  { name: "NZD", code: "NZD" },
  { name: "GBP", code: "GBP" },
  { name: "HKD", code: "HKD" },
  { name: "SGD", code: "SGD" },
  { name: "EUR", code: "EUR" },
  { name: "INR", code: "INR" },
  { name: "CAD", code: "CAD" },
];

const AddProject = () => {
  const [validated, setValidated] = useState(false);
  const [addMilestoneModal, setMilestoneModal] = useState(false);

  const [state, setState] = useState({
    hasRecruiter: false,
    totalAmount: 0,
    status: "new",
    awardedAt: new Date(),
  });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [assignee, setAssignee] = useState([]);
  const { userInfo } = useSelector((state) => state.userLogin);

  // dropdown options
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);

  // behavior states
  const [revertState, setRevertState] = useState(null);
  const [editAble, setEditAble] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  const history = useHistory();

  const { id } = useParams();

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;

    if (name === "profile") {
      const tempProfile = profiles.find((pro) => pro._id === value);
      setSelectedProfile(tempProfile);

      if (tempProfile?.platform !== "freelancer") {
        setState((prev) => {
          return {
            ...prev,
            hasRecruiter: false,
          };
        });
      }
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

  const changeAssignee = (value) => {
    if (value.length !== 0 && state.status === "new") {
      setState((prev) => ({ ...prev, status: "open" }));
    }
    setAssignee(value);
  };

  // set values
  useEffect(() => {
    const populateForm = async () => {
      const profileRes = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/profiles/1000/0`,
        {
          bidder: userInfo.role !== "admin" && userInfo._id,
        }
      );
      var tempProfiles = profileRes.data.data;

      const userRes = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/1000/0`
      );
      setUsers(
        userRes.data.data.map((user) => {
          return {
            value: user._id,
            label: user.userName,
          };
        })
      );

      if (id) {
        const projectRes = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`
        );

        const tempProject = projectRes.data;

        setSelectedProfile(tempProject.profile);
        setIsClosed(tempProject.status === "closed");

        // if it is not user's project don't show profile options
        const isMyProject = tempProfiles.some(
          (p) => p.id === tempProject.profile._id
        );
        if (!isMyProject && userInfo.role !== "admin") {
          tempProfiles = [tempProject.profile];
        }
        tempProject.profile = tempProject.profile._id;
        setState((prev) => ({ ...prev, ...tempProject }));
      } else {
        setEditAble(true);
      }
      setProfiles(tempProfiles);
    };

    populateForm().then(() => setLoading(false));
  }, [id, userInfo._id, userInfo.role]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setValidated(true);

    setMilestoneModal(false);

    if (state.exchangeRate === 0) {
      return toast.error("Please Enter Valid Exchange rate");
    }

    state.assignee = assignee.map((item) => item.value);

    if (id) {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
        state
      );
      if (res.status === 200) {
        // toast.success("Project Updated Successfully");
        setEditAble(false);
      } else {
        toast.error("Sorry, couldn't update the project");
      }
    } else {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/projects/`,
        state
      );
      if (res.status === 201) {
        toast.success("Project Created Successfully");
        history.push(`/projects`);
      }
    }
  };
  console.log(selectedProfile, "AddProject");

  return (
    <div>
      <div>
        {" "}
        <Card>
          <Card.Header className="text-center">
            <h1>Project Detail</h1>
          </Card.Header>
          {loading ? (
            <Row>
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
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="my-2 mx-3">
                <Row className="my-2">
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      Title
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        *
                      </span>
                    </Form.Label>
                    <Form.Control
                      readOnly={!editAble}
                      name="title"
                      onChange={handleChange}
                      type="text"
                      value={state.title ?? ""}
                      placeholder="Enter title"
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      Profile
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        *
                      </span>
                    </Form.Label>
                    <Form.Control
                      readOnly={!editAble || isClosed}
                      as="select"
                      name="profile"
                      onChange={(value) => {
                        if (editAble && !isClosed) handleChange(value);
                      }}
                      value={state.profile ?? ""}
                      required
                    >
                      <option key="initial" value="">
                        Select-Profile
                      </option>
                      {profiles.map((profile, index) => {
                        return (
                          <option key={index} value={profile._id}>
                            {profile.title} ({profile.platform})
                          </option>
                        );
                      })}
                    </Form.Control>
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
                      isDisabled={!editAble || isClosed}
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Client Name</Form.Label>
                    <Form.Control
                      readOnly={!editAble}
                      type="text"
                      value={state.clientName ?? ""}
                      placeholder="Client Name"
                      name="clientName"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Client Country</Form.Label>
                    <Form.Control
                      readOnly={!editAble}
                      type="text"
                      value={state.clientCountry ?? ""}
                      placeholder="Client Country"
                      name="clientCountry"
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      Project Type
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        *
                      </span>
                    </Form.Label>
                    <Form.Control
                      readOnly={!editAble || isClosed}
                      as="select"
                      name="projectType"
                      onChange={(value) => {
                        if (editAble && !isClosed) handleChange(value);
                      }}
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
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>
                      Currency
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        *
                      </span>
                    </Form.Label>
                    <Form.Control
                      readOnly={!editAble}
                      as="select"
                      name="currency"
                      onChange={(value) => handleChange(value)}
                      value={state.currency ?? ""}
                      required
                    >
                      <option key="initial" value="">
                        Select Currency
                      </option>
                      {currency_list.map((item, index) => (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Control>
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
                      readOnly={!editAble || isClosed}
                      as="select"
                      name="status"
                      onChange={(value) => {
                        if (editAble) {
                          handleChange(value);
                        }
                      }}
                      value={state.status}
                      required
                    >
                      {assignee?.length === 0 && (
                        <option value="new">New</option>
                      )}
                      <option value="open">Open</option>
                      <option value="underreview">Underreview</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="closed">Closed</option>
                    </Form.Control>
                  </Form.Group>
                </Row>

                <Row className="mt-3 ml-3 align-items-center">
                  <Form.Group className="mt-4" as={Col} md="2">
                    <Form.Check
                      type="checkbox"
                      name="hasRecruiter"
                      checked={state.hasRecruiter ?? false}
                      label={`Has Recruiter`}
                      disabled={selectedProfile?.platform !== "freelancer"}
                      onChange={(value) => {
                        if (editAble && !isClosed) handleChange(value);
                      }}
                    />
                  </Form.Group>
                  {state.hasRecruiter && (
                    <Form.Group as={Col} md="4">
                      <Form.Label>Recruiter Name</Form.Label>
                      <Form.Control
                        readOnly={!editAble}
                        type="text"
                        placeholder="Recruiter Name"
                        name="recruiterName"
                        onChange={handleChange}
                        value={state.recruiterName ?? ""}
                      />
                    </Form.Group>
                  )}
                </Row>

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
                      readOnly={!editAble}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Closed At</Form.Label>
                    <Form.Control
                      type="date"
                      value={
                        state.closedAt
                          ? moment(state.closedAt).format("YYYY-MM-DD")
                          : ""
                      }
                      placeholder="Closed At"
                      name="closedAt"
                      onChange={handleChange}
                      readOnly={!editAble}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Deadline At</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Deadline At"
                      value={
                        state.deadlineAt
                          ? moment(state.deadlineAt).format("YYYY-MM-DD")
                          : ""
                      }
                      name="deadlineAt"
                      onChange={handleChange}
                      readOnly={!editAble}
                    />
                  </Form.Group>
                </Row>
              </Row>

              {!id ? (
                <Button
                  disabled={loading}
                  className="p-2 m-3"
                  variant="success"
                  md={3}
                  type="submit"
                >
                  {loading && (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  Create
                </Button>
              ) : userInfo.role === "user" && !userInfo.isManager ? (
                <></>
              ) : !editAble ? (
                <Button
                  className="p-2 m-3"
                  variant="outline-primary"
                  md={3}
                  onClick={() => {
                    setRevertState(state);
                    setEditAble(true);
                  }}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    className="p-2 m-3"
                    variant="success"
                    md={3}
                    disabled={loading}
                    type="submit"
                  >
                    {loading && (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    Save
                  </Button>
                  <Button
                    className="p-2 m-3"
                    md={3}
                    variant="outline-danger"
                    onClick={() => {
                      setState(revertState);
                      setValidated(false);
                      setEditAble(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Form>
          )}
        </Card>
      </div>
      {id && (
        <Row>
          <Row>
            <Col md={3}></Col>
            <Col md={5}></Col>
            <Col md={4}>
              {" "}
              <Button
                className="m-3 "
                onClick={() => setMilestoneModal(true)}
                style={{ float: "right" }}
              >
                Add Milestone
              </Button>
              <MyModal
                size="xl"
                show={addMilestoneModal}
                heading="Add Milestone"
                onClose={() => setMilestoneModal(false)}
                style={{ width: "auto" }}
              >
                <Milestone
                  projectID={id}
                  profile={selectedProfile}
                  hasRecruiter={state.hasRecruiter}
                  setShowModal={() => {
                    setMilestoneModal(false);
                  }}
                />
              </MyModal>
            </Col>
          </Row>
          <ShowMilestone projectID={id} profile={selectedProfile} />
        </Row>
      )}
    </div>
  );
};

export default AddProject;
