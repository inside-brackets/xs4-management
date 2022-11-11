import React, { Fragment, useState } from "react";
import { Row, Badge } from "react-bootstrap";
import Table from "../table/SmartTable";
import { useSelector } from "react-redux";
import moment from "moment";
import status_map from "../../assets/JsonData/milestone_status_map.json";
import ActionButton from "../UI/ActionButton";
import { formatter } from "../../util/currencyFormatter";
import MyModal from "../../components/modals/MyModal"
import UpdateMilestone from "./UpdateMilestone";

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
const ShowMilestone = ({ projectID, profile }) => {
  console.log(profile, "profile in showmilestone");
  const { userInfo } = useSelector((state) => state.userLogin);
  const [defaultValue, setDefaultValue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.title}</td>
      {(userInfo.role === "admin" || userInfo.isManager) && (
        <Fragment>
          <td>{formatter(item.currency).format(item.totalAmount)}</td>
          <td>{formatter(item.currency).format(item.netRecieveable)}</td>
          <td>{formatter(item.currency).format(item.amountDeducted)}</td>
          <td>{formatter(item.currency).format(item.amountRecieved)}</td>
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

  var body = { project: projectID };
  var filter = {};

  return (
    <Row>
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
      <MyModal
        size="lg"
        show={showModal}
        heading={"Edit Milestone"}
        onClose={() => {
          // setDefaultValue(null);
          setShowModal(false);
        }}
        style={{ width: "auto" }}
      >
        <UpdateMilestone
          defaultValue={defaultValue}
          profile={profile}
          onSuccess={() => {
            setDefaultValue(null);
            setRerenderTable(Math.random());
            setShowModal(false);
          }}
        />
      </MyModal>
    </Row>
  );
};

export default ShowMilestone;
