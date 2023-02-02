import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import ActionButton from "../../components/UI/ActionButton";
import Table from "../../components/table/SmartTable";
import MyModal from "../../components/modals/MyModal";
import ExpenseEdit from "../../components/Expense";
import moment from "moment";
import { capitalizeFirstLetter } from "../../util/string";

const customerTableHead = [
  "#",
  "Description",
  "Date",
  "Amount",
  "Category",
  "Profile",
  "actions",
];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const PAGE_SIZE = 50;

const Expense = () => {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [defaultValue, setDefaultValue] = useState(null);
  const [rerenderTable, setRerenderTable] = useState(null);
  const { userInfo } = useSelector((state) => state.userLogin);

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * PAGE_SIZE}</td>
      <td>{item.description ?? "N/A"}</td>
      <td>
        {item.date ? moment(item.date).format("DD MMM YYYY") : Date.now()}
      </td>
      <td>{item.amount ?? 0}</td>
      <td>
        {item.category
          .replace(/_/g, " ")
          .replace(/(?: |\b)(\w)/g, function (key) {
            return key.toUpperCase();
          })}
      </td>
      <td>{item.profile?.title ?? "N/A"}</td>
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
      profile: item.profile?.title ? capitalizeFirstLetter(item.profile?.title): "N/A",
      date: item.data ? moment(item.date).format("DD MMM") : "N/A",
      category: item.category ? capitalizeFirstLetter(item.category.replace("_", " ")): null,
      description: capitalizeFirstLetter(item.description),
      amount: formatter("PKR").format(item.amount),
    };
  };
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/profiles/1000/0`)
      .then((res) => {
        const profileOptions = res.data.data.map((profile) => ({
          label: profile.title,
          value: profile._id,
        }));

        setProfile(profileOptions);
      });
  }, []);

  var filter = {};
  var body = {};

  if (userInfo.role === "admin" || userInfo.handleExpense) {
    filter = {
      category: [
        { label: "Office ", value: "office" },
        { label: "Profile Membership", value: "profileMembership" },
      ],
      date_range: "date",

      profile: profile,
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
              Add Expense
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
            title="expenses"
            limit={PAGE_SIZE}
            headData={customerTableHead}
            renderHead={(item, index) => renderHead(item, index)}
            api={{
              url: `${process.env.REACT_APP_BACKEND_URL}/expense`,
              body,
            }}
            placeholder={"description"}
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
        heading={`${defaultValue ? "Edit" : "Create"} Expense`}
        onClose={() => {
          setDefaultValue(null);
          setShowModal(false);
        }}
        style={{ width: "auto" }}
      >
        <ExpenseEdit
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

export default Expense;
