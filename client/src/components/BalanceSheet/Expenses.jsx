import React from "react";

function Expenses() {
  return (
    <>
      <h1 className="h-1">Expenses</h1>
      <div className="flex-row flex-center space-between pad-b1">
        <div className="flex-col">
          <span className="h-2">Basic Salaries (A)</span>
          <input
            type="number"
            value="7"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Basic Salaries (G)</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Graphic Partner</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Employee Share</span>
          <input
            type="text"
            value="PKR 99999"
            className="input-display max-200"
            readOnly
          />
        </div>
      </div>
      <div className="flex-row flex-center space-between pad-b15">
        <div className="flex-col">
          <span className="h-2">Other Expenses</span>
          <input
            type="number"
            value="7"
            className="input-display max-200"
            readOnly
          />
        </div>
        <div className="flex-col">
          <span className="h-2">Adjustments</span>
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
        <div className="max-200 min-200"></div>
      </div>
    </>
  );
}

export default Expenses;
