import React from "react";
import { Table, Badge } from "react-bootstrap";
import moment from "moment";

function Milestones({ milestones, flag }) {
  return (
    <Table bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Project</th>
          <th>Milestone</th>
          <th>Amount Received</th>
          <th>Employee Share</th>
          <th>Payment Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {milestones && flag ? (
          milestones.map((milestone, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{milestone.project.title}</td>
                <td>{milestone.title}</td>
                <td>{milestone.amountRecieved}</td>
                <td>{milestone.employeeShare}</td>
                <td>{moment(milestone.paymentDate).format("ll")}</td>
                <td>
                  <Badge bg="success">Paid</Badge>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={7}>
              <div className="text-center m-3 alert alert-danger show">
                No Milestones completed!
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default Milestones;
