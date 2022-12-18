import React, { useState, useEffect } from "react";

function Revenues({ data }) {
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    setTotalRevenue(
      Number(
        data.revenues.amountReceived + data.revenues.otherReceived
      ).toFixed(2)
    );
  }, [data]);

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
          <span className="h-2">Total</span>
          <input
            type="text"
            value={"PKR " + totalRevenue}
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="max-200 min-200"></div>
      </div>
    </>
  );
}

export default Revenues;
