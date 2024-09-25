import React from "react";

function Incentive({ gross, incentive }) {
  return (
    <>
      <div className="dis-flex dis-row mar-b-2">
        <div className="dis-flex dis-col mar-r-075">
          <span className="txt-1 line-1 fon-med mar-b-1">Company Gross</span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={"PKR " + gross}
          />
        </div>
        <div className="dis-flex dis-col">
          <span className="txt-1 line-1 fon-med mar-b-1">Employee Cut</span>
          <input
            className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
            readOnly
            value={"PKR " + incentive ?? 0}
          />
        </div>
      </div>
    </>
  );
}

export default Incentive;
