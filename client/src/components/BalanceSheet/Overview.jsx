import React from "react";

function Overview() {
  return (
    <>
      <h1 className="h-1">Overview</h1>
      <div className="flex-row flex-center space-between pad-b1">
        <div className="flex-col">
          <span className="h-2">Total Projects</span>
          <input
            type="number"
            value="7"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Profiles</span>
          <input
            type="number"
            value="4"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Revenue</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Expenses</span>
          <input
            type="text"
            value="PKR 99999"
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
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Graphic Share</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Total Employee Share</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">End Balance</span>
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

export default Overview;
