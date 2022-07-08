import React, { useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const Profiles = ({ user,defaultValue }) => {
  const [state, setState] = useState({ bidder: user?._id });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if(!defaultValue){
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/profiles`,
      state
    );
    if (res.status === 200) {
      toast.success("Profile Edit Sucessfully");
    } else {
      toast.error(res.data.message);
    }
  } else {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/profiles/${defaultValue._id}`,
      state
    );
    if (res.status === 200) {
      toast.success("Profile Edit Sucessfully");
    } else {
      toast.error(res.data.message);
    }
  }
  };
  return (
    <Row>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Title"
              name="title"
              required
              defaultValue={defaultValue ? defaultValue.title : null}
              onChange={handleChange}
              type="text"
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Platform</Form.Label>
            <Form.Control
              as="select"
              required
              name="platform"
              defaultValue={defaultValue ? defaultValue.platform : null}
              onChange={handleChange}
            >
              <option value={null}>Select-Platform</option>
              <option value="freelancer">Freelancer</option>
              <option value="fiver">Fiver</option>
              <option value="upwork">Upwork</option>
            </Form.Control>

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
              defaultValue={defaultValue ? defaultValue.share: null}
              onChange={handleChange}
              type="number"
            />
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Form.Label>Platform Fee</Form.Label>
            <Form.Control
              placeholder="Plaform Fee"
              required
              name="platformFee"
              defaultValue={defaultValue ? defaultValue.platformFee: null}
              onChange={handleChange}
              type="number"
            />
          </Form.Group>
          <Row className="mt-3">
            <Col md="6">
              <Button type="submit">Submit</Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </Row>
  );
};

export default Profiles;
