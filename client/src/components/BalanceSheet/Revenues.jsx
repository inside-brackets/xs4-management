import React from "react";

function Revenues() {
  return (
    <>
      <h1 className="h-1">Revenues</h1>
      <div className="flex-row flex-center space-between pad-b15">
        <div className="flex-col">
          <span className="h-2">Amount Received</span>
          <input
            type="number"
            value="7"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Other Revenues</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Graphics Share</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
      </div>
    </>
  );
}

export default Revenues;
