import React, { useState, useEffect } from "react";

function Expenses({ data }) {
  const [totalExpense, setTotalExpense] = useState(0);
  const [graphicPartner, setGraphicPartner] = useState(0);
  const [adjustments, setAdjustments] = useState(0);
  const [accountSalaries, setAccountSalaries] = useState(0);
  const [graphicSalaries, setGraphicSalaries] = useState(0);

  useEffect(() => {
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
  }, [data]);

  useEffect(() => {
    let temp = 0;
    temp = data.revenues.graphicShare - graphicSalaries;
    if (temp !== 0) {
      temp = temp / 2;
    }
    setGraphicPartner(temp);
    setTotalExpense(
      data.expenses.employeeShare +
        temp +
        data.expenses.otherExpenses +
        graphicSalaries +
        accountSalaries
    );
  }, [graphicSalaries]);

  return (
    <>
      <h1 className="h-1">Expenses</h1>
      <div className="flex-row flex-center space-between pad-b1">
        <div className="flex-col">
          <span className="h-2">Basic Salaries (A)</span>
          <input
            type="text"
            value={"PKR " + accountSalaries}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Basic Salaries (G)</span>
          <input
            type="text"
            value={"PKR " + graphicSalaries}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Graphic Partner</span>
          <input
            type="text"
            value={"PKR " + graphicPartner}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Employee Share</span>
          <input
            type="text"
            value={"PKR " + data.expenses.employeeShare}
            className="input-display max-200"
            readOnly
          />
        </div>
      </div>
      <div className="flex-row flex-center space-between pad-b15">
        <div className="flex-col">
          <span className="h-2">Other Expenses</span>
          <input
            type="text"
            value={"PKR " + data.expenses.otherExpenses}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Adjustments</span>
          <input
            type="text"
            value={"PKR " + adjustments}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total</span>
          <input
            type="text"
            value={"PKR " + totalExpense}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="max-200 min-200"></div>
      </div>
    </>
  );
}

export default Expenses;
