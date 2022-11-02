import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { round } from "../../util/number";
import { useSelector } from "react-redux";
const AddMilestone = ({ projectID, profile, hasRecruiter, defaultValue }) => {
  const [state, setState] = useState({
    project: projectID,
    profile: profile,
    hasRecruiter: hasRecruiter,
    totalAmount: 0,
    status: "unpaid",
    paymentDate: new Date(),
  });

  const { userInfo } = useSelector((state) => state.userLogin);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revertState, setRevertState] = useState(null);
  const [editAble, setEditAble] = useState(false);

  // invoice calculation states
  const [netRecieveable, setNetRecieveable] = useState(0);
  const [amountDeducted, setAmountDeducted] = useState(0);

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
        .post(`${process.env.REACT_APP_BACKEND_URL}/milestone`, state)
        .then((res) => {
          toast.success("Milestone Created Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.msg ?? err.response.statusText);
          setLoading(false);
        });
    } else {
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/milestone/${defaultValue._id}`,
          state
        )
        .then((res) => {
          toast.success("Milestone Updated Sucessfully");
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.msg ?? err.response.statusText);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    let amtDec = 0;
    let netRec = 0;
    let platformFee;
    if (profile?.platform === "freelancer") {
      platformFee = 0.1;
      var recruiterFee = 0.05;
      if (state.hasRecruiter) {
        if (state.status === "paid") {
          if (
            state.totalAmount < 50 &&
            state.totalAmount > 0 &&
            !state.hasRecruiter
          ) {
            amtDec = 5;
          } else {
            amtDec = (platformFee + recruiterFee) * state.totalAmount;
          }
        } else {
          amtDec = 0;
        }
      } else {
        amtDec = platformFee * state.totalAmount;
      }
    } else if (profile?.platform === "fiver") {
      platformFee = 0.2;
      if (state.status === "paid") {
        amtDec = platformFee * state.totalAmount;
      } else {
        amtDec = 0;
      }
    } else if (profile?.platform === "upwork") {
      if (state.status === "closed") {
        if (state.totalAmount <= 500) {
          platformFee = 0.2;
          amtDec = platformFee * state.totalAmount;
        } else {
          platformFee = 0.1;
          let moreThanFive = state.totalAmount - 500;
          amtDec = moreThanFive * platformFee + 100;
        }
      } else {
        amtDec = 0;
      }
    }

    netRec = state.totalAmount - amtDec;
    setAmountDeducted(Math.round(amtDec * 100) / 100);
    setNetRecieveable(netRec);

    if (state.status === "paid") {
      setState((prev) => {
        let amountRecievedInPKR =
          netRec * prev.exchangeRate + Number(prev.adjustment ?? 0);

        let shareInPKR = profile
          ? profile.share * (amountRecievedInPKR / 100)
          : 0;
        return {
          ...prev,
          employeeShare: round(shareInPKR, 2),
          amountRecieved: round(amountRecievedInPKR, 2),
        };
      });
    }
  }, [
    state.status,
    state.totalAmount,
    profile,
    ,
    state.hasRecruiter,
    state.exchangeRate,
    state.adjustment,
  ]);

  return (
    <Row>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
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
                  // readOnly={!editAble}
                  name="title"
                  onChange={handleChange}
                  type="text"
                  defaultValue={defaultValue ? defaultValue.title : null}
                  placeholder="Enter title"
                  required
                />
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
                  //  readOnly={!editAble || isClosed}
                  as="select"
                  name="status"
                  onChange={(value) => {
                    // if (editAble && !isClosed) {
                    handleChange(value);
                    // }
                  }}
                  value={state.status ?? ""}
                  required
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Payment Date </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Payment Date"
                  defaultValue={
                    defaultValue ? defaultValue.paymentDate : Date.now()
                  }
                  name="paymentDate"
                  onChange={handleChange}
                  required
                  //  readOnly={!editAble}
                />
              </Form.Group>
            </Row>
            <Row className="my-2">
              {
                <>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                      //  readOnly={!editAble || (!recalculate && id)}
                      type="number"
                      placeholder="Total Amount"
                      name="totalAmount"
                      value={state.totalAmount ?? 0}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="3">
                    <Form.Label>Amnt Recieved</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="-"
                      defaultValue={
                        defaultValue ? defaultValue.amountRecieved : null
                      }
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Amnt Deduct</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="-"
                      name="amountDeducted"
                      value={amountDeducted}
                      // defaultValue={
                      //   defaultValue ? defaultValue.amountDeducted : null
                      // }
                      readOnly
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Net Recieve</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="-"
                      readOnly
                      onChange={handleChange}
                      value={netRecieveable}
                      // defaultValue={
                      //   defaultValue ? defaultValue.netRecieveable : null
                      // }
                    />
                  </Form.Group>
                </>
              }
            </Row>
            <Row className="my-2">
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Employee Share{" "}
                  <span>{` ${profile ? profile.share : ""}%`}</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="-"
                  readOnly
                  value={state.employeeShare ?? 0}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Grahic Share <span>{` ${profile ? profile.share : ""}`}</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="-"
                  readOnly
                  defaultValue={defaultValue ? defaultValue.grahicShare : null}
                />
              </Form.Group>

              <Form.Group as={Col} md="4">
                <Form.Label>Exchange Rate</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  step="any"
                  //  readOnly={!editAble || (!recalculate && id)}
                  defaultValue={defaultValue ? defaultValue.exchangeRate : null}
                  name="exchangeRate"
                  required={state.status === "unpaid"}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
          </Row>

          {/* <Row>
            <Col md={3}></Col>
            <Col md={5}></Col>
            <Col md={4}></Col>
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
          </Row> */}
        </Row>
        {!defaultValue ? (
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
    </Row>
  );
};

export default AddMilestone;
