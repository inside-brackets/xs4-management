import React, { useState, useEffect } from "react";

function Revenues({ data }) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [graphicShare, setGraphicShare] = useState(0);
  const [graphicSalaries, setGraphicSalaries] = useState(0);

  useEffect(() => {
    if (data.expenses.salaries.length > 0) {
      data.expenses.salaries.forEach((v, i) => {
        if (v.department === "graphics") {
          setGraphicSalaries(v.base);
        }
      });
    } else {
      setGraphicSalaries(0);
    }
  }, [data]);

  useEffect(() => {
    let temp = 0;
    temp = data.revenues.graphicShare - graphicSalaries;
    if (temp !== 0) {
      temp = temp / 2;
    }
    setGraphicShare(temp);
    setTotalRevenue(
      data.revenues.amountReceived + temp + data.revenues.otherReceived
    );
  }, [graphicSalaries]);

  return (
    <>
      <h1 className="h-1">Revenues</h1>
      <div className="flex-row flex-center space-between pad-b15">
        <div className="flex-col">
          <span className="h-2">Amount Received</span>
          <input
            type="text"
            value={"PKR " + data.revenues.amountReceived}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Other Revenues</span>
          <input
            type="text"
            value={"PKR " + data.revenues.otherReceived}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Graphics Share</span>
          <input
            type="text"
            value={"PKR " + graphicShare}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total</span>
          <input
            type="text"
            value={"PKR " + totalRevenue}
            className="input-display max-200"
            readOnly
          />
        </div>
      </div>
    </>
  );
}

export default Revenues;
