//*Dropzone.js*//

import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Row, Col, Button, Form, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "../UI/DropZone";
import axios from "axios";
function FileUploading({ projectID }) {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({});
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ));

  const handleUpload = async (e) => {
    e.preventDefault();
    let arr = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      const { data: url } = await axios(
        `${process.env.REACT_APP_BACKEND_URL}/upload/s3url/documents/${
          e.target.name.value
        }.${acceptedFiles[0].type.split("/")[1]}`
      );
      await axios.put(url, acceptedFiles[i]);
      arr[i] = url.split("?")[0];
    }
    const updatedProject = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/projects/${projectID}`,
      {
        files: [
          {
            name: e.target.name.value,
            type: e.target.type.value,

            files: arr,
          },
        ],
        updateFiles: true,
      }
    );

    setFile(updatedProject.data);

    toast.success("File Uploaded");
  };
  return (
    <>
      <div>
        <Form onSubmit={handleUpload}>
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
                <p className="dropzone-content">
                  Release to drop the files here
                </p>
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
            // onClick={handleUpload}
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
            Upload
          </Button>
        </Form>
      </div>
    </>
  );
}

export default FileUploading;
