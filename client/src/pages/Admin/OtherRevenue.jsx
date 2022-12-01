import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import ActionButton from "../../components/UI/ActionButton";
import Table from "../../components/table/SmartTable";
import MyModal from "../../components/modals/MyModal";
import RevenueEdit from "../../components/OtherRevenue";
import moment from "moment";

const customerTableHead = [
  "#",
  "Client",
  "Description",
  "Date",
  "Amount",
  "Category",
  "actions",
];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const PAGE_SIZE = 50;

const OtherRevenue = () => {
  const [showModal, setShowModal] = useState(false);
  const [defaultValue, setDefaultValue] = useState(null);
  const [rerenderTable, setRerenderTable] = useState(null);
  const { userInfo } = useSelector((state) => state.userLogin);

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.client ?? "N/A"}</td>
      <td>{item.description ?? "N/A"}</td>
      <td>
        {item.date ? moment(item.date).format("DD MMM YYYY") : Date.now()}
      </td>
      <td>{item.amount ?? 0}</td>
      <td>{item.category}</td>

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
  const renderExportData = (item) => {
    return {
      client: item.client ?? "N/A",
      descrption: item.descrption,
      category: item.category ?? null,
      date: item.data ? moment(item.date).format("DD MMM") : "N/A",
      amount: item.amount,
    };
  };

  var filter = {};
  var body = {};

  if (userInfo.role === "admin" || userInfo.handleExpense) {
    filter = {
      category: [
        { label: "Office ", value: "office" },
        { label: "Profile Membership", value: "profileMembership" },
      ],
      date_range: "date",
    };
  }
  return (
    <Row>
      <Row className="m-3">
        <Col md={3}></Col>
        <Col md={5}></Col>
        <Col md={4}>
          {userInfo.handleExpense || userInfo.role === "admin" ? (
            <Button
              onClick={() => {
                setShowModal(true);
              }}
              style={{ float: "right" }}
            >
              Add Revenue
            </Button>
          ) : (
            <></>
          )}
        </Col>
      </Row>
      <div className="card">
        <div className="card__body">
          <Table
            key={rerenderTable}
            title="other_revenue"
            limit={PAGE_SIZE}
            headData={customerTableHead}
            renderHead={(item, index) => renderHead(item, index)}
            api={{
              url: `${process.env.REACT_APP_BACKEND_URL}/other_revenue`,
              body,
            }}
            placeholder={"client"}
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
        heading={`${defaultValue ? "Edit" : "Create"} Revenue`}
        onClose={() => {
          setDefaultValue(null);
          setShowModal(false);
        }}
        style={{ width: "auto" }}
      >
        <RevenueEdit
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

export default OtherRevenue;
