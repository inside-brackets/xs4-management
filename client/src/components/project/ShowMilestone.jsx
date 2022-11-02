import React, { Fragment, useState } from "react";
import { Row, Badge } from "react-bootstrap";
import Table from "../table/SmartTable";
import { useSelector } from "react-redux";
import moment from "moment";
import status_map from "../../assets/JsonData/milestone_status_map.json";
import ActionButton from "../UI/ActionButton";
import { formatter } from "../../util/currencyFormatter";
import MyModal from "../../components/modals/MyModal";
import AddMilestone from "./AddMilestone";
const renderHead = (item, index) => <th key={index}>{item}</th>;
const PAGE_SIZE = 50;
const ShowMilestone = () => {
  const [users, setUsers] = useState(null);
  const { userInfo } = useSelector((state) => state.userLogin);
  const [defaultValue, setDefaultValue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(null);

  const customerTableHead =
    userInfo.role === "admin" || userInfo.isManager
      ? [
          "#",
          "Title",
          "Total Amount",
          "Amount Deducted",
          "Net Recevible",
          "Amount Dectucted",
          "Payment Date",
          "Status",
          "Actions",
        ]
      : [
          "#",
          "Title",
          "Total Amount",
          "Amount Deducted",
          "Net Recevible",
          "Amount Recevied",
          "Payment Date",
          "Status",
          "Actions",
        ];

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.title}</td>
      {(userInfo.role === "admin" || userInfo.isManager) && (
        <Fragment>
          <td>{formatter(item.currency).format(item.totalAmount)}</td>
          <td>{formatter(item.currency).format(item.netRecieveble)}</td>
          <td>{formatter(item.currency).format(item.amountDetucted)}</td>
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
  const renderExportData = (item, index, currPage) => {
    return {
      Title: item.title,
      status: item.status,
      paymentDate: item.paymentDate
        ? moment(item.paymentDate).format("DD MMM")
        : "N/A",
      totalAmount:
        userInfo.role === "admin" &&
        formatter(item.currency).format(item.totalAmount),
      netRecieveble:
        userInfo.role === "admin" &&
        formatter(item.currency).format(item.netRecieveble),
      amountDetucted:
        userInfo.role === "admin" &&
        formatter(item.currency).format(item.amountDetucted),
      amountRecieved:
        userInfo.role === "admin" &&
        formatter(item.currency).format(item.amountRecieved),
    };
  };
  var body = {};
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
            // placeholder={"title | client name"}
            filter={filter}
            renderBody={(item, index, currPage) =>
              renderBody(item, index, currPage)
            }
            renderExportData={(data) => renderExportData(data)}
            exportData
          />
        </div>
      </div>
      <MyModal
        size="lg"
        show={showModal}
        heading={`${defaultValue ? "Edit" : "Create"} Milestone`}
        onClose={() => {
          setDefaultValue(null);
          setShowModal(false);
        }}
        style={{ width: "auto" }}
      >
        <AddMilestone
          defaultValue={defaultValue}
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
