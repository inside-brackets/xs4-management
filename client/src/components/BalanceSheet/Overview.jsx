import React, { useState, useEffect } from "react";

function Overview({ data }) {
  const [balance, setBalance] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profilesNet, setProfilesNet] = useState(0);
  const [adjustments, setAdjustments] = useState(0);
  const [accountSalaries, setAccountSalaries] = useState(0);
  const [graphicSalaries, setGraphicSalaries] = useState(0);

  useEffect(() => {
    setProfilesNet(
      data.revenues.amountReceived -
        (data.revenues.graphicShare + data.expenses.employeeShare)
    );
    if (data.expenses.salaries.length > 0) {
      data.expenses.salaries.forEach((v, i) => {
        setAdjustments(adjustments + v.adjustment);
        if (v.department === "accounts") {
          setAccountSalaries(v.base);
        } else {
          setGraphicSalaries(v.base);
        }
      });
    } else {
      setAdjustments(0);
      setAccountSalaries(0);
      setGraphicSalaries(0);
    }
  }, [adjustments, data]);

  useEffect(() => {
    let temp = 0;
    temp = data.revenues.graphicShare - graphicSalaries;
    if (temp !== 0) {
      temp = temp / 2;
    }
    setTotalRevenue(
      Number(
        data.revenues.amountReceived + data.revenues.otherReceived
      ).toFixed(2)
    );
    setTotalExpenses(
      Number(
        data.expenses.employeeShare +
          temp +
          data.expenses.otherExpenses +
          graphicSalaries +
          accountSalaries
      ).toFixed(2)
    );
  }, [accountSalaries, graphicSalaries, data]);

  useEffect(() => {
    setBalance(Number(totalRevenue - totalExpenses).toFixed(2));
  }, [totalRevenue, totalExpenses]);

  return (
    <>
      <h1 className="h-1">Overview</h1>
      <div className="flex-row flex-center space-between pad-b1">
        <div className="flex-col">
          <span className="h-2">Total Projects</span>
          <input
            type="number"
            value={data.projects}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Profiles</span>
          <input
            type="number"
            value={data.profiles}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Graphic Share</span>
          <input
            type="text"
            value={"PKR " + data.revenues.graphicShare}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Employee Share</span>
          <input
            type="text"
            value={"PKR " + data.expenses.employeeShare}
            className="input-display max-200"
            readOnly
          />
        </div>
      </div>
      <div className="flex-row flex-center space-between pad-b1">
        <div className="flex-col">
          <span className="h-2">Profile Net Total</span>
          <input
            type="text"
            value={"PKR " + profilesNet}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Revenue</span>
          <input
            type="text"
            value={"PKR " + totalRevenue}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Expenses</span>
          <input
            type="text"
            value={"PKR " + totalExpenses}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">End Balance</span>
          <input
            type="text"
            value={"PKR " + balance}
            className="input-display max-200"
            readOnly
          />
        </div>
      </div>
    </>
  );
}

export default Overview;
