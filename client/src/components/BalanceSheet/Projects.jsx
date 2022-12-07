import React from "react";
import { Table } from "react-bootstrap";

function Projects() {
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
            <th className="text-center">Total</th>
            <th className="text-center">Cut</th>
            <th>Date</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Title</td>
            <td>Project</td>
            <td>Milestone</td>
            <td className="text-center">999</td>
            <td className="text-center">99</td>
            <td>123</td>
            <td className="text-center">Done</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default Projects;
