import React from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addLog, updateLog } from "../../store/Actions/logsActions";

const ProjectForm = ({ show, handleClose, edit }) => {
  const { projects } = useSelector(state => state?.project);
  const { addLoading } = useSelector(state => state?.logs);

  const dispatch = useDispatch();
  const handleSubmit = async e => {
    e.preventDefault();
    if (edit) {
      dispatch(
        updateLog({
          description: e.target.description.value,
          project: e.target.project.value,
          id: show._id
        })
      );
    } else {
      await dispatch(
        addLog({
          description: e.target.description.value,
          project: e.target.project.value
        })
      );
    }
    handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Projects</Form.Label>
            <Form.Select
              name="project"
              required
              aria-label="Default select example"
              defaultValue={edit ? show.project._id : ""}
            >
              {projects?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <FloatingLabel controlId="floatingTextarea2" label="Description">
            <Form.Control
              required
              name="description"
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
              defaultValue={edit ? show.description : ""}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button disabled={addLoading} variant="primary" type="submit">
            {addLoading ? "Loading..." : edit ? "Edit" : "Submit"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
