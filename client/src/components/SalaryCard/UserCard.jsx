import React from "react";
import { Col, Row } from "react-bootstrap";

import dummy_img from "../../assets/images/anon_user.png";

function UserCard({ user, month, readOnly }) {
  return (
    <>
      <Row>
        <Col>
          <h1 className="txt-2 fon-bold mar-b-1">User Details</h1>
          <div className="w-100 h-96 p-0-2 mar-b-2 dis-flex dis-row dis-center dis-between bg-smoke border border-r-1">
            <div className="dis-flex dis-row dis-center">
              <img
                className="salary-user-img"
                src={dummy_img}
                alt="user-image"
              />
              <div className="dis-flex dis-col dis-start">
                <span className="txt-1 line-1 fon-med mar-b-025 txt-black">
                  {user.userName}
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  {(user.firstName ?? "Someone") +
                    " " +
                    (user.lastName ?? "Lazy")}
                </span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Email:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  {user.email}
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Phone:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  {user.contact}
                </span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Department:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  {user.department}
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Role:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Month:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  {month ?? "-"}
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Salary:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  {readOnly ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default UserCard;
