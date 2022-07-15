import axios from "axios";
import React, { useEffect, useState } from "react";
import Report from "../../components/Report";

const Reports = () => {
  const [reports, setReports] = useState(null);
  useEffect(() => {
    const getReports = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reports/profiles_summary/2022`
      );
      if (res.status === 200) {
        console.log(res.data);
        setReports(res.data);
      }
    };
    getReports();
  }, []);

  return (
    <>
      {" "}
      {!reports ? (
        <div>loading</div>
      ) : (
        <>
          {reports.map((report) => (
            <Report report={report} />
          ))}
        </>
      )}
    </>
  );
};

export default Reports;
