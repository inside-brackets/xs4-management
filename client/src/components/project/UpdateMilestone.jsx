import React, { useEffect, useState } from "react";
import { Col, Row, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { round } from "../../util/number";

const UpdateMilestone = ({ projectID, profile, defaultValue }) => {
  const [state, setState] = useState({
    project: projectID,
    defaultValue,
  });

  const [mileValue, setmileValue] = useState(defaultValue);
  console.log(mileValue.totalAmount, "mileValue.totalAmount");
  console.log(defaultValue, "defaultValue");
  console.log(defaultValue.totalAmount, "defaultValue.totalAmount");

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/milestone/${defaultValue._id}`,
        {
          title: mileValue.title,
          status: mileValue.status,
          totalAmount: mileValue.totalAmount,
          exchangeRate: mileValue.exchangeRate,
          employeeShare: mileValue.employeeShare,
          grahicShare: mileValue.grahicShare,
          amountRecieved: mileValue.amountRecieved,
          netRecieveable: mileValue.netRecieveable,
          amountDeducted: mileValue.amountDeducted,
          paymentDate: mileValue.paymentDate,
        }
      );

      setmileValue({ mileValue: res.data });
      if (res.status === 200) {
        setLoading(false);
        toast.success("Project Updated Successfully");

        setmileValue({ mileValue: res.data });
        // console.log(res.data);
      } else {
        toast.error("Sorry, couldn't update the project");
      }
    }
  };

  useEffect(() => {
    let amtDec = 0;
    let netRec = 0;
    let platformFee;
    console.log(profile?.platform, "profile.platform===><");
    if (profile?.platform === "freelancer") {
      platformFee = 0.1;
      var recruiterFee = 0.05;
      if (mileValue.hasRecruiter) {
        if (mileValue.status === "paid") {
          if (
            mileValue.totalAmount < 50 &&
            mileValue.totalAmount > 0 &&
            !mileValue.hasRecruiter
          ) {
            amtDec = 5;
          } else {
            amtDec = (platformFee + recruiterFee) * mileValue.totalAmount;
          }
        } else {
          amtDec = 0;
        }
      } else {
        amtDec = platformFee * mileValue.totalAmount;
      }
    } else if (profile?.platform === "fiver") {
      platformFee = 0.2;
      if (mileValue.status === "paid") {
        amtDec = platformFee * mileValue.totalAmount;
      } else {
        amtDec = 0;
      }
    } else if (profile?.platform === "upwork") {
      if (mileValue.status === "paid") {
        if (mileValue.totalAmount <= 500) {
          platformFee = 0.2;
          amtDec = platformFee * mileValue.totalAmount;
        } else {
          platformFee = 0.1;
          let moreThanFive = mileValue.totalAmount - 500;
          amtDec = moreThanFive * platformFee + 100;
        }
      } else {
        amtDec = 0;
      }
    }

    netRec = mileValue.totalAmount - amtDec;

    if (mileValue.status === "paid") {
      setmileValue((prev) => {
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
    setmileValue((prev) => {
      let amountDeductedInPKR = (amtDec * 100) / 100;
      let netRecieveableInPKR = netRec;
      return {
        ...prev,
        amountDeducted: round(amountDeductedInPKR, 2),
        netRecieveable: round(netRecieveableInPKR, 2),
      };
    });
    setmileValue((prev) => {
      let amountDeductedInPKR = (amtDec * 100) / 100;
      let netRecieveableInPKR = netRec;
      console.log(amountDeductedInPKR, "amountDeductedInPKR setmileValue");
      return {
        ...prev,
        defaultValue: {
          amountDeducted: round(amountDeductedInPKR, 2),
          netRecieveable: round(netRecieveableInPKR, 2),
        },
      };
    });
  }, [
    mileValue.status,
    mileValue.totalAmount,
    mileValue.profile,
    mileValue.employeeShare,
    mileValue.hasRecruiter,
    mileValue.exchangeRate,
    mileValue.amountRecieved,
    mileValue.amountDeducted,
    mileValue.netRecieveable,
  ]);

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;

    if (name === "status") {
      if (value === "paid") {
        setmileValue((prev) => ({ ...prev, paymentDate: new Date() }));
      } else {
        setmileValue((prev) => {
          const temp = prev;
          delete temp.paymentDate;
          delete temp.employeeShare;
          delete temp.netRecieveable;
          return temp;
        });
      }
    }

    setmileValue((prev) => ({
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
                  defaultValue={
                    defaultValue
                      ? defaultValue.title
                      : state
                      ? state.title
                      : "unpaid"
                  }
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
                  value={mileValue.status}
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
                  value={mileValue.paymentDate}
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
                  defaultValue={mileValue.totalAmount}
                  value={mileValue.totalAmount}
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
                  value={mileValue.exchangeRate}
                  name="exchangeRate"
                  disabled={mileValue.status === "unpaid"}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Graphic Share</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Graphic Share"
                  name="grahicShare"
                  value={mileValue.grahicShare}
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
                      readOnly
                      value={mileValue.employeeShare}
                      disabled={mileValue.status === "unpaid"}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="3">
                    <Form.Label>Amnt Received</Form.Label>
                    <Form.Control
                      type="number"
                      name="amtRec"
                      value={mileValue.amountRecieved}
                      disabled={mileValue.status === "unpaid"}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Amnt Deduct</Form.Label>
                    <Form.Control
                      type="number"
                      name="amtDect"
                      value={mileValue.amountDeducted}
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
                        state.defaultValue
                          ? defaultValue.netRecieveable
                          : state
                          ? state.netRecieveable
                          : ""
                      }
                      value={mileValue.netRecieveable}
                      readOnly
                    />
                  </Form.Group>
                </>
              }
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
