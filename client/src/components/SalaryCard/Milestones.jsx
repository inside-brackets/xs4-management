import React from "react";
import { Table, Badge } from "react-bootstrap";
import moment from "moment";

function Milestones({ milestones, gross, share, flag }) {
  return (
    <Table className="custom-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Profile</th>
          <th>Project</th>
          <th>Milestone</th>
          <th className="text-center">Total</th>
          <th className="text-center">Cut</th>
          <th>Date</th>
          <th className="text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        {milestones && flag ? (
          milestones.map((milestone, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{milestone.profile.title}</td>
                <td>{milestone.project.title}</td>
                <td>{milestone.title}</td>
                <td className="text-center">{milestone.amountRecieved}</td>
                <td className="text-center">{milestone.employeeShare}</td>
                <td>{moment(milestone.paymentDate).format("Do MMM")}</td>
                <td className="text-center">
                  <Badge bg="success">Paid</Badge>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={8}>
              <div className="text-center m-3 alert alert-danger show">
                No Milestones completed!
              </div>
            </td>
          </tr>
        )}
        {flag ? (
          <tr className="tabrow">
            <td colSpan={4} className="text-center fon-bold">
              Total
            </td>
            <td className="text-center fon-bold">{gross}</td>
            <td className="text-center fon-bold">{share}</td>
            <td colSpan={2}></td>
          </tr>
        ) : (
          <></>
        )}
      </tbody>
    </Table>
  );
}

export default Milestones;
