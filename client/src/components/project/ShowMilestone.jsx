import React, { Fragment, useState } from "react";
import { Row, Badge, Col, Button } from "react-bootstrap";
import Table from "../table/SmartTable";
import { useSelector } from "react-redux";
import moment from "moment";
import status_map from "../../assets/JsonData/milestone_status_map.json";
import ActionButton from "../UI/ActionButton";
// import { formatter } from "../../util/currencyFormatter";
import MyModal from "../../components/modals/MyModal";
import UpdateMilestone from "./UpdateMilestone";
import Milestone from "./AddMilestone";
import { round } from "../../util/number";

const customerTableHead = [
  "#",
  "Title",
  "Total Amount",
  "Net receivable",
  "Amount Deducted",
  "Amount received",
  "Payment Date",
  "Status",
  "Actions",
];
const renderHead = (item, index) => <th key={index}>{item}</th>;
const PAGE_SIZE = 50;

const ShowMilestone = ({
  projectID,
  profile,
  setSumAmount,
  sumAmount,
  hasRecruiter,
}) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [defaultValue, setDefaultValue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);
  const [addMilestoneModal, setAddMilestoneModal] = useState(false);
  var tA = 0;
  const renderBody = (item, index, currPage) => {
    tA = tA + item.totalAmount;
    setSumAmount(tA);
    return (
      <tr key={index}>
        <td>{index + 1 + currPage * PAGE_SIZE}</td>
        <td>{item.title}</td>
        {(userInfo.role === "admin" || userInfo.isManager) && (
          <Fragment>
            <td>{round(item.totalAmount)}</td>
            <td>{round(item.netRecieveable)}</td>
            <td>{round(item.amountDeducted)}</td>
            <td>{round(item.amountRecieved)}</td>
            {/* <td>{formatter(item.currency).format(item.totalAmount)}</td>
            <td>{formatter(item.currency).format(item.netRecieveable)}</td>
            <td>{formatter(item.currency).format(item.amountDeducted)}</td>
            <td>{formatter(item.currency).format(item.amountRecieved)}</td> */}
          </Fragment>
        )}
        <td>
          {item.paymentDate ? moment(item.paymentDate).format("DD MMM") : "N/A"}
        </td>
        <td>
          <h5>
            <Badge bg={status_map[item.status]}>{item.status}</Badge>
          </h5>
        </td>
        <td>
          <ActionButton
            type="edit"
            onClick={() => {
              setDefaultValue(item);
              setShowModal(true);
            }}
          />
        </td>
      </tr>
    );
  };

  var body = { project: projectID };
  var filter = {};

  return (
    <div>
      {" "}
      {userInfo.isManager || userInfo.role === "admin" ? (
        <Row>
          <Row className="m-3">
            <Col md={3}></Col>
            <Col md={5}></Col>
            <Col md={4}>
              <Button
                onClick={() => {
                  setAddMilestoneModal(true);
                }}
                style={{ float: "right" }}
              >
                Add Milestone
              </Button>
            </Col>
          </Row>
          <div className="card">
            <div className="card__body">
              <Table
                key={rerenderTable}
                title="Milestone"
                limit={PAGE_SIZE}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                api={{
                  url: `${process.env.REACT_APP_BACKEND_URL}/milestone`,
                  body,
                }}
                filter={filter}
                renderBody={(item, index, currPage) =>
                  renderBody(item, index, currPage)
                }
              />
            </div>
          </div>
          <Row>
            <Col md={4}>
              {" "}
              <MyModal
                size="lg"
                show={addMilestoneModal}
                heading="Add Milestone"
                onClose={() => {
                  setDefaultValue(null);
                  setAddMilestoneModal(false);
                }}
                style={{ width: "auto" }}
              >
                <Milestone
                  projectID={projectID}
                  profile={profile}
                  hasRecruiter={hasRecruiter}
                  setShowModal={() => {
                    setAddMilestoneModal(false);
                  }}
                  onSuccess={() => {
                    setDefaultValue(null);
                    setRerenderTable(Math.random());
                    setAddMilestoneModal(false);
                  }}
                />
              </MyModal>
            </Col>
          </Row>
          <MyModal
            size="lg"
            show={showModal}
            heading="Edit Milestone"
            onClose={() => {
              setShowModal(false);
            }}
            style={{ width: "auto" }}
          >
            <UpdateMilestone
              defaultValue={defaultValue}
              profile={profile}
              setShowModal={() => {
                setShowModal(false);
              }}
              onSuccess={() => {
                setRerenderTable(Math.random());
                setShowModal(false);
              }}
            />
          </MyModal>
        </Row>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ShowMilestone;
