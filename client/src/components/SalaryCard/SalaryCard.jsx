import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import "./SalaryCard.css";
import UserCard from "./UserCard";
import Adjustments from "./Adjustments";
import Incentive from "./Incentive";
import Milestones from "./Milestones";

function SalaryDetailsCard({
  user,
  readOnly,
  setReadOnly,
  salary,
  year,
  month,
}) {
  const history = useHistory();

  const [error, setError] = useState(false);
  const [base, setBase] = useState(0);
  const [adjustments, setAdjustments] = useState([]);
  const [adjustment, setAdjustment] = useState(0);
  const [gross, setGross] = useState(0);
  const [incentive, setIncentive] = useState(0);
  const [milestones, setMilestones] = useState([]);
  const [table, setTable] = useState(null);

  useEffect(() => {
    setBase(user.salary);
    if (user.isManager) {
      getProjects(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (salary) {
      setBase(salary.base);
      setAdjustments(salary.adjustment);
    }
  }, [salary]);

  useEffect(() => {
    let total = 0;
    adjustments.forEach((x, i) => {
      total += Number(x.amount);
    });
    setAdjustment(total);
  }, [adjustments]);

  useEffect(() => {
    if (milestones.length > 0) {
      setTable(
        <Milestones
          milestones={milestones}
          gross={gross}
          share={incentive}
          flag={true}
        />
      );
    } else {
      setTable(<Milestones flag={false} />);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milestones]);

  const getProjects = async (id) => {
    const projects = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/salary/get/projects`,
      headers: { "Content-Type": "application/json" },
      data: {
        user: id,
        year: year,
        month: month,
      },
    });
    setMilestones(projects.data.milestones);
    setGross(projects.data.gross);
    setIncentive(projects.data.share);
  };

  const handleClick = () => {
    let check = true;
    if (adjustments.length > 0) {
      if (
        adjustments[adjustments.length - 1].desc === "" ||
        adjustments[adjustments.length - 1].amount === ""
      ) {
        check = false;
      }
    }
    if (check) {
      setAdjustments([
        ...adjustments,
        {
          desc: "",
          amount: "",
        },
      ]);
    } else {
      setError(true);
    }
  };

  const postSalary = async () => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/salary/create`,
      headers: { "Content-Type": "application/json" },
      data: {
        user: user._id,
        year: year,
        month: month,
        adjustment: adjustments,
        incentive: incentive,
        base: base,
      },
    });
    setReadOnly(true);
    toast.success("Salary Paid!");
  };

  return (
    <Card className="p-32 border">
      <Card.Body className="p-0">
        {user && (
          <UserCard
            user={user}
            month={new Date(year, month, 1).toLocaleString("default", {
              month: "long",
            })}
            readOnly={readOnly}
          />
        )}
        <h1 className="txt-2 fon-bold mar-b-1">Overview</h1>
        <div className="mar-b-2 dis-flex dis-row dis-between">
          <div className="dis-flex dis-col">
            <span className="txt-1 line-1 fon-med mar-b-1">Base Salary</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value={"PKR " + base}
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-1 line-1 fon-med mar-b-1">Incentive</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value={"PKR " + incentive}
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-1 line-1 fon-med mar-b-1">Adjustment</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value={"PKR " + adjustment}
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-1 line-1 fon-med mar-b-1">Total</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value={"PKR " + (base + incentive + adjustment)}
            />
          </div>
        </div>
        <div className="mar-b-1 dis-flex dis-row dis-bottom">
          <h1 className="mar-b-0 mar-r-15 txt-2 fon-bold">Adjustment</h1>
          {readOnly ? (
            <></>
          ) : (
            <span
              className="txt-875 fon-med custom-btn cur-pointer"
              onClick={handleClick}
            >
              Add+
            </span>
          )}
        </div>
        <Adjustments
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          error={error}
          setError={setError}
          readOnly={readOnly}
        />
        <h1 className="txt-2 fon-bold mar-b-1">Incentive</h1>
        {user && user.isManager ? (
          <>
            <Incentive gross={gross} incentive={incentive} />
            <hr />
            <h1 className="txt-1 fon-bold mar-b-1">Breakdown</h1>
            {table}
          </>
        ) : (
          <div className="mar-b-1">
            <span className="txt-1 line-1 fon-med txt-grey">None</span>
          </div>
        )}
        <hr />
        <div className="dis-flex dis-row dis-between">
          <Button
            type="view"
            variant="secondary"
            onClick={(e) => {
              history.push("/salaries");
            }}
          >
            {readOnly ? "Go Back" : "Cancel"}
          </Button>
          <Button
            type="view"
            variant="primary"
            disabled={readOnly}
            onClick={postSalary}
          >
            {readOnly ? "Paid" : "Pay"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SalaryDetailsCard;
