import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const Expenses = ({ profile, defaultValue, onSuccess }) => {
  const [state, setState] = useState({
    profile: profile?._id,
    isLocal: defaultValue?.isLocal,
  });

  const [profiles, setProfiles] = useState([]);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    if (name === "isLocal") {
      setState((prev) => {
        return {
          ...prev,
          isLocal: !state.isLocal,
        };
      });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/profiles/100/0`)
      .then((res) => {
        setProfiles(res.data.data);
      });
  }, []);

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
        .post(`${process.env.REACT_APP_BACKEND_URL}/expense`, state)
        .then((res) => {
          onSuccess();
          toast.success("Expense Created Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.msg ?? err.response.statusText);
          setLoading(false);
        });
    } else {
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/expense/${defaultValue._id}`,
          state
        )
        .then((res) => {
          onSuccess();
          toast.success("Expense Updated Sucessfully");
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
            <Form.Check
              className="m-4"
              type="checkbox"
              name="isLocal"
              checked={state.isLocal ? true : false}
              label={`Is Local`}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="6" className="my-4">
            <Form.Label>Profile</Form.Label>
            <Form.Select
              name="profile"
              onChange={handleChange}
              disabled={state.isLocal !== false}
              required
            >
              {" "}
              <option>{defaultValue?.profile?.title ?? null}</option>
              {profiles.map((profile) => (
                <option value={profile._id}>{profile.title}</option>
              ))}{" "}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
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

export default Expenses;
