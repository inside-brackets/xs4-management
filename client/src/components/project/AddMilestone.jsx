import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { round } from "../../util/number";
import { useSelector } from "react-redux";
const AddMilestone = ({ projectID, profile, defaultValue }) => {
  const [state, setState] = useState({
    project: projectID,
    defaultValue,
  });

  const { userInfo } = useSelector((state) => state.userLogin);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;

    if (name === "status") {
      if (value === "paid") {
        setState((prev) => ({ ...prev, paymentDate: new Date() }));
      } else {
        setState((prev) => {
          const temp = prev;
          delete temp.paymentDate;
          delete temp.employeeShare;
          return temp;
        });
      }
    }
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      console.log("state==>", state.title);
      console.log("state==>", state.totalAmount);

      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/milestone/${defaultValue._id}`,
        {
          title: state.title,
          status: state.status,
          totalAmount: state.totalAmount,
          exchangeRate: state.exchangeRate,
          employeeShare: state.employeeShare,
          grahicShare: state.grahicShare,
          amountRecieved: event.target.amtRec.value,
          netRecieveable: event.target.netRec.value,
          amountDeducted: event.target.amtDect.value,
          paymentDate: state.paymentDate,
        }
      );
      setState({ defaultValue: res.data });
      if (res.status === 200) {
        toast.success("Project Updated Successfully");
        setState({ defaultValue: res.data });
        console.log(res.data);
      } else {
        toast.error("Sorry, couldn't update the project");
      }
    }
  };

  // calculate amount deducted
  // calculate amount recieved and employee share
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

    netRec = state.totalAmount - amtDec;

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
          amountDeducted: round(amountDeductedInPKR, 2),
          netRecieveable: round(netRecieveableInPKR, 2),
        };
      });
    }

    setState((prev) => {
      let amountDeductedInPKR = (amtDec * 100) / 100;
      let netRecieveableInPKR = netRec;

      return {
        ...prev,
        amountDeducted: round(amountDeductedInPKR, 2),
        netRecieveable: round(netRecieveableInPKR, 2),
      };
    });
  }, [
    state.status,
    state.totalAmount,
    state.profile,
    state.employeeShare,
    state.hasRecruiter,
    state.exchangeRate,
    state.amountRecieved,
    state.amountDeducted,
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
                  name="title"
                  onChange={handleChange}
                  type="text"
                  defaultValue={
                    defaultValue
                      ? defaultValue.title
                      : state
                      ? state.title
                      : "unpaid"
                  }
                  //defaultValue={defaultValue ? defaultValue.title : null}
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
                  defaultValue={defaultValue ? defaultValue.status : " "}
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
                  defaultValue={
                    defaultValue
                      ? defaultValue.paymentDate
                      : state
                      ? state.paymentDate
                      : " "
                  }
                  // defaultValue={defaultValue ? defaultValue.paymentDate : " "}
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
                  defaultValue={
                    defaultValue
                      ? defaultValue.totalAmount
                      : state
                      ? state.totalAmount
                      : ""
                  }
                  // defaultValue={
                  //   state.defaultValue ? state.defaultValue.totalAmount : null
                  // }
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Exchange Rate</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  step="any"
                  defaultValue={
                    defaultValue
                      ? defaultValue.exchangeRate
                      : state
                      ? state.exchangeRate
                      : ""
                  }
                  //defaultValue={defaultValue ? defaultValue.exchangeRate : null}
                  name="exchangeRate"
                  required={state.status === "unpaid"}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Graphic Share</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Graphic Share"
                  name="grahicShare"
                  defaultValue={
                    defaultValue
                      ? defaultValue.grahicShare
                      : state
                      ? state.grahicShare
                      : ""
                  }
                  //defaultValue={defaultValue ? defaultValue.grahicShare : null}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row>
            <Row className="my-2">
              {
                <>
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
                      readOnly
                      defaultValue={
                        defaultValue
                          ? defaultValue.employeeShare
                          : state
                          ? state.employeeShare
                          : ""
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="3">
                    <Form.Label>Amnt Received</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="-"
                      name="amtRec"
                      defaultValue={
                        defaultValue
                          ? defaultValue.amountRecieved
                          : state
                          ? state.amountRecieved
                          : ""
                      }
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Amnt Deduct</Form.Label>
                    <Form.Control
                      type="number"
                      name="amtDect"
                      placeholder="-"
                      defaultValue={
                        defaultValue
                          ? defaultValue.amountDeducted
                          : state
                          ? state.amountDeducted
                          : ""
                      }
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Net Recieve</Form.Label>
                    <Form.Control
                      type="number"
                      name="netRec"
                      placeholder="-"
                      defaultValue={
                        defaultValue
                          ? defaultValue.netRecieveable
                          : state
                          ? state.netRecieveable
                          : ""
                      }
                      readOnly
                    />
                  </Form.Group>
                </>
              }
            </Row>
          </Row>
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
        ) : (
          <>
            <Button
              className="p-2 m-3"
              variant="success"
              md={3}
              //disabled={loading}
              type="submit"
            >
              {/* {loading && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )} */}
              Save
            </Button>
          </>
        )}
      </Form>
    </Row>
  );
};

export default AddMilestone;
