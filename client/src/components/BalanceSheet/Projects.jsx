import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import moment from "moment";

function Projects({ data }) {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      setFlag(true);
    } else {
      setFlag(false);
    }
  }, [data]);

  return (
    <>
      <h1 className="h-1">Cleared Projects</h1>
      <Table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Profile</th>
            <th>Project</th>
            <th>Milestone</th>
            <th className="text-center">Received</th>
            <th className="text-center">Employee Cut</th>
            <th className="text-center">Graphic Cut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {flag ? (
            data.map((v, i) => {
              return v.milestones.map((milestone, index) => {
                return (
                  <tr key={index}>
                    <td>{i + 1}</td>
                    <td>{v.profile.title + " (" + v.profile.platform + ")"}</td>
                    <td>{v.title}</td>
                    <td>{milestone.title}</td>
                    <td className="text-center">{milestone.amountRecieved}</td>
                    <td className="text-center">{milestone.employeeShare}</td>
                    <td className="text-center">{milestone.grahicShare}</td>
                    <td>{moment(milestone.paymentDate).format("Do MMM")}</td>
                  </tr>
                );
              });
            })
          ) : (
            <tr>
              <td colSpan={8}>
                <div className="text-center m-3 alert alert-danger show">
                  No Projects completed!
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}

export default Projects;
