import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { round } from "../../util/number";

const UpdateMilestone = ({ projectID, profile, defaultValue, onSuccess }) => {
  const [state, setState] = useState(defaultValue);
  const [paymentDate, setPaymentDate] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(true);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setPaymentDate(
      new Date(defaultValue.paymentDate).toISOString().split("T")[0]
    );
  }, [defaultValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    setLoading(true);
    if (defaultValue) {
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/milestone/${defaultValue._id}`,
          {
            title: state.title,
            status: state.status,
            totalAmount: state.totalAmount,
            exchangeRate: state.exchangeRate,
            employeeShare: state.employeeShare,
            grahicShare: state.grahicShare,
            amountRecieved: state.amountRecieved,
            netRecieveable: state.netRecieveable,
            amountDeducted: state.amountDeducted,
            paymentDate: state.paymentDate,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            onSuccess();
            setLoading(false);
            toast.success("Project Updated Successfully");
          } else {
            onSuccess();
            setLoading(false);
            toast.error("Sorry, couldn't update the project");
          }
        });
    }
  };

  useEffect(() => {
    if (dirty) {
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
          if (
            state.totalAmount < 50 &&
            state.totalAmount > 0 &&
            !state.hasRecruiter
          ) {
            amtDec = 5;
          } else {
            amtDec = platformFee * state.totalAmount;
          }
        }
      } else if (profile?.platform === "fiver") {
        platformFee = 0.2;
        if (state.status === "paid") {
          amtDec = platformFee * state.totalAmount;
        } else {
          amtDec = 0;
        }
      } else if (profile?.platform === "upwork") {
        if (state.status === "paid") {
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

      if (edited) {
        netRec = state.totalAmount - state.amountDeducted;
      } else {
        netRec = state.totalAmount - amtDec;
      }

      if (state.status === "paid") {
        setState((prev) => {
          let amountRecievedInPKR = netRec * prev.exchangeRate + Number(0);
          let amountDeductedInPKR = (amtDec * 100) / 100;
          let netRecieveableInPKR = netRec;
          let shareInPKR = profile
            ? profile.share * (amountRecievedInPKR / 100)
            : 0;
          return {
            ...prev,
            employeeShare: round(shareInPKR, 2),
            amountRecieved: round(amountRecievedInPKR, 2),
            amountDeducted: edited
              ? state.amountDeducted
              : round(amountDeductedInPKR, 2),
            netRecieveable: round(netRecieveableInPKR, 2),
          };
        });
      }

      setState((prev) => {
        let amountDeductedInPKR = (amtDec * 100) / 100;
        let netRecieveableInPKR = netRec;

        return {
          ...prev,
          amountDeducted: edited
            ? state.amountDeducted
            : round(amountDeductedInPKR, 2),
          netRecieveable: round(netRecieveableInPKR, 2),
        };
      });
    }
  }, [
    state.status,
    state.totalAmount,
    state.profile,
    state.employeeShare,
    state.hasRecruiter,
    state.exchangeRate,
    state.amountRecieved,
    state.amountDeducted,
    profile,
    dirty,
  ]);

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    setDirty(true);

    if (name === "status") {
      if (value === "paid") {
        setState((prev) => ({ ...prev, paymentDate: new Date() }));
      } else {
        setState((prev) => {
          const temp = prev;
          delete temp.paymentDate;
          delete temp.employeeShare;
          delete temp.netRecieveable;
          return temp;
        });
      }
    }
    if (name === "amountDeducted") {
      setEdited(true);
    }
    if (name === "totalAmount") {
      setEdited(false);
    }
    if (name === "paymentDate") {
      setPaymentDate(value);
    }

    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
                  name="title"
                  onChange={handleChange}
                  type="text"
                  value={state ? state.title : ""}
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
                  as="select"
                  name="status"
                  onChange={(value) => {
                    handleChange(value);
                  }}
                  value={state ? state.status : ""}
                  required
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Payment Date </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Payment Date"
                  value={paymentDate ? paymentDate : ""}
                  name="paymentDate"
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>

            <Row className="my-2">
              <Form.Group as={Col} md="4">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Total Amount"
                  name="totalAmount"
                  value={state ? state.totalAmount : ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Amount Deducted</Form.Label>
                <Form.Control
                  type="number"
                  name="amountDeducted"
                  placeholder="-"
                  value={state ? state.amountDeducted : ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Net Receivable</Form.Label>
                <Form.Control
                  type="number"
                  name="netRec"
                  placeholder="-"
                  value={state ? state.netRecieveable : ""}
                  disabled
                />
              </Form.Group>
            </Row>
            <Row className="my-2">
              <Form.Group as={Col} md="3">
                <Form.Label>Exchange Rate</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  step="any"
                  value={state ? state.exchangeRate : ""}
                  name="exchangeRate"
                  disabled={state.status !== "paid"}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>Amount Received</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="-"
                  name="amtRec"
                  value={state ? state.amountRecieved : ""}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>
                  EmpShare{" "}
                  <span style={{ color: "red" }}>{` ${
                    profile ? profile.share : ""
                  }%`}</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="-"
                  disabled
                  value={state ? state.employeeShare : ""}
                />
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>Graphic Share</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Graphic Share"
                  name="grahicShare"
                  value={state ? state.grahicShare : ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
          </Row>
        </Row>

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
          Update
        </Button>
      </Form>
    </Row>
  );
};

export default UpdateMilestone;
