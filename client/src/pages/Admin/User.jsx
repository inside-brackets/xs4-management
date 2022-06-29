import React from 'react'
import {Row} from 'react-bootstrap'

import Table from '../../components/table/SmartTable'
const customerTableHead = [
    "#",
    "First Name",
    "Last Name",
    "Bank",
    "role",
    "",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const User = () => {
    const renderBody = (item, index,currPage) => (
        <tr key={index}>
          <td>{(index + 1) + (currPage*10)}</td>
          <td>{item.user_name ?? "NA"}</td>
          <td>{item.weight ? item.weight : "NA"}</td>
          <td>{item.bank ? item.bank.name : "NA"}</td>
          <td>{item.role ?? "NA"}</td>
        </tr>
      );
    
  return (
    <Row>
    <div className="card">
      <div className="card__body">
        <Table
          limit={10}
          headData={customerTableHead}
          renderHead={(item, index) => renderHead(item, index)}
          api={{
            url: `${process.env.REACT_APP_BACKEND_URL}/users`,
            body:{

            }
          }}
          placeholder={"Load Number / Broker"}
          filter={{
            status: [
              { label: "Booked ", value: "booked" },
              { label: "Ongoing ", value: "ongoing" },
              { label: "Delivered ", value: "delivered" },
              { label: "Canceled ", value: "canceled" },
            ],
          }}
          renderBody={(item, index,currPage) => renderBody(item, index,currPage)}
        />
      </div>
    </div>
  </Row>
  )
}

export default User