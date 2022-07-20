import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const Profiles = ({ user, defaultValue, onSuccess }) => {
  const [state, setState] = useState({ bidder: user?._id });
  const [users, setUsers] = useState([]);
  const [changeUser, setChangeUser] = useState(false);

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/users/100/0`)
        .then((res) => {
          setUsers(res.data.data);
        });
    }
  }, [defaultValue]);

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
        .post(`${process.env.REACT_APP_BACKEND_URL}/profiles`, state)
        .then((res) => {
          onSuccess();
          toast.success("Profile Created Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);

          toast.error(err.response.data.msg ?? err.response.statusText);
          setLoading(false);
        });
    } else {
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/profiles/${defaultValue._id}`,
          state
        )
        .then((res) => {
          onSuccess();
          toast.success("Profile Updated Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.msg ?? err.response.statusText);
          setLoading(false);
        });
    }
  };

  console.log("default value", defaultValue, state);
  return (
    <Row>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Title"
              name="title"
              defaultValue={defaultValue ? defaultValue.title : null}
              onChange={handleChange}
              type="text"
              required
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Platform</Form.Label>
            <Form.Select
              required
              name="platform"
              defaultValue={defaultValue ? defaultValue.platform : ""}
              onChange={handleChange}
            >
              <option value="">Select-Platform</option>
              <option value="freelancer">Freelancer</option>
              <option value="fiver">Fiver</option>
              <option value="upwork">Upwork</option>
            </Form.Select>

            <Form.Control.Feedback type="invalid">
              Please provide a valid Platform.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Share</Form.Label>
            <Form.Control
              placeholder="Share"
              required
              name="share"
              min={0}
              defaultValue={defaultValue ? defaultValue.share : null}
              onChange={handleChange}
              type="number"
            />
          </Form.Group>
          {defaultValue && (
            <Col className="text-center" style={{
              marginTop:'29px'
            }}>
              <Button onClick={() => setChangeUser(!changeUser)}>
                Change User
              </Button>{" "}
            </Col>
          )}
          {changeUser && (
            <Form.Group as={Col} md="6">
              <Form.Label>Assignee</Form.Label>
              <Form.Control
                as="select"
                name="bidder"
                onChange={handleChange}
                required
              >
                {" "}
                {users.filter(item=> item.isManager).map((user) => (
                  <option value={user._id}>{user.userName}</option>
                ))}{" "}
              </Form.Control>
            </Form.Group>
          )}
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

export default Profiles;
