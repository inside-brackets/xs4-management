//*Dropzone.js*//

import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Row, Col, Button, Form, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "./dropzone.css";
import axios from "axios";
function DropZone({ projectID }) {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({});
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ));

  const handleUpload = async (e) => {
    e.preventDefault();
    const { data: url } = await axios(
      `${process.env.REACT_APP_BACKEND_URL}/upload/s3url/documents/${projectID}.png`
    );
    await axios.put(url, acceptedFiles[0]);
    const updatedProject = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/projects/${projectID}`,
      {
        files: {
          name: "testing",
          type: "chat12",
          file: url.split("?")[0],
        },
        updateFiles: true,
      }
    );
    setFile(updatedProject.data);
    toast.success("File Uploaded");
  };
  return (
    <>
      <div>
        <Row>
          <Row className="my-2 mx-3">
            <Row className="my-2">
              <Form.Group as={Col} md="6">
                <Form.Label>
                  Name
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter name"
                  required
                />
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>
                  Type
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control as="select" name="type" required>
                  <option value="chat">Chat</option>
                  <option value="others">Others</option>
                </Form.Control>
              </Form.Group>
            </Row>
          </Row>
        </Row>
        <div {...getRootProps({ className: "dropzone" })}>
          <input
            className="input-zone"
            {...getInputProps()}
            type="file"
            name="file"
            // onChange={drop}
          />
          <div className="text-center">
            {isDragActive ? (
              <p className="dropzone-content">Release to drop the files here</p>
            ) : (
              <p className="dropzone-content">
                Drag’n’drop some files here, or click to select files
              </p>
            )}
            <button type="button" className="butn">
              Click to select files
            </button>
          </div>
          <aside>
            <ul>{files}</ul>
          </aside>
        </div>
        <Button
          disabled={loading}
          className="p-2  mx-5 my-4"
          variant="success"
          md={3}
          type="submit"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </div>
    </>
  );
}

export default DropZone;
