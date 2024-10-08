import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./table.css";
import { Row, Col, Form, Alert, Spinner, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
const makeFilter = (filter) => {
  let temp = {};
  filter[filter.startDate.label] = filter.startDate.value;
  filter[filter.endDate.label] = filter.endDate.value;
  delete filter.startDate;
  delete filter.endDate;
  for (let [key, value] of Object.entries(filter)) {
    if (value instanceof Array) {
      value = value.map((item) => item.value ?? item);
    }
    temp[key.toLowerCase()] = value;
  }
  return temp;
};

const Table = (props) => {
  const [bodyData, setBodyData] = useState({});
  const [filter, setFilter] = useState(
    Object.keys(props.filter).reduce((pre, curr) => {
      pre[curr] = [];
      return pre;
    }, {})
  );
  const [currPage, setCurrPage] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState({ label: null, value: null });
  const [endDate, setEndDate] = useState({ label: null, value: null });
  const [reRender, setReRender] = useState(false);
  let pages = 1;
  let range = [];

  if (props.limit !== undefined) {
    let page = Math.floor(totalLength / Number(props.limit));
    pages = totalLength % Number(props.limit) === 0 ? page : page + 1;
    range = [...Array(pages).keys()];
  }
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [search, filter, currPage, endDate]);

  useEffect(() => {
    setBodyData([]);
    setReRender(true);
    setTimeout(() => {
      setReRender(false);
    }, 500);
    // eslint-disable-next-line
  }, [props.refresh]);

  useEffect(() => {
    if (reRender) {
      getData();
    }
    // eslint-disable-next-line
  }, [reRender]);

  const selectPage = (page) => {
    setCurrPage(page);
  };

  const searchData = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
      setBodyData([]);
      getData();
    }
  };
  const filterData = (value, key) => {
    setFilter((oldValue) => {
      const temp = { ...oldValue };
      temp[key] = value;
      return temp;
    });
  };

  const getData = () => {
    if (!bodyData[`page${currPage}`]) {
      if (props.api) {
        setLoading(true);

        axios
          .post(
            `${props.api.url}/${props.limit}/${currPage * props.limit}`,
            makeFilter({
              ...filter,
              search,
              ...props.api.body,
              startDate,
              endDate,
            })
          )
          .then((res) => {
            const pageKey = `page${currPage}`;
            setBodyData((prev) => {
              let temp = prev;
              temp[pageKey] = res.data.data;
              return temp;
            });
            setTotalLength(res.data.length);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            setError(err);
          });
      }
    }
  };

  const downloadExcel = () => {
    axios
      .post(
        `${props.api.url}/${totalLength}/0`,
        makeFilter({ ...filter, search, ...props.api.body, startDate, endDate })
      )
      .then(({ data }) => {
        const sortedData = data.data.map((item, index) => {
          var json_data = { "Sr.": index + 1, ...props.renderExportData(item) };
          return json_data;
        });
        const worksheet = XLSX.utils.json_to_sheet(sortedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, `${props.title} DataSheet.xlsx`);
      });
  };

  let bodyHtml = null;
  if (loading) {
    bodyHtml = (
      <Row>
        <Col className="text-center">
          <Spinner
            animation="border"
            variant="primary"
            style={{
              height: "50px",
              width: "50px",
            }}
          />
        </Col>
      </Row>
    );
  } else if (error) {
    bodyHtml = (
      <Row className="justify-content-center">
        <Col>
          <Alert variant="danger" className="text-center text-capitalize m-3">
            {error.message}
          </Alert>
        </Col>
      </Row>
    );
  } else if (bodyData["page0"]?.length === 0) {
    bodyHtml = (
      <Row
        className="justify-content-center"
        style={{ maxWidth: "95%", paddingLeft: "5%" }}
      >
        <Col>
          <Alert variant="danger" className="text-center text-capitalize m-3">
            No {props.title} to show
          </Alert>
        </Col>
      </Row>
    );
  }

  return (
    <div>
      <Row className="align-items-center">
        {props.placeholder && (
          <Col md={3}>
            <label className="pb-2">Search</label>
            <input
              type="text"
              placeholder={props.placeholder}
              className="form-control mb-2"
              icon="bx bx-search"
              onKeyDown={searchData}
              disabled={loading}
            />
          </Col>
        )}

        {Object.keys(props.filter).map((key, index) => {
          if (key.includes('_checkbox')){
            return(
              <>
              <Col md={2}>
                <label className="pb-2">{`${key.replace('_checkbox','')}:`}</label>
                <input
                  type="checkbox"
                  checked={filter[key]}
                  onChange={(e) => {
                    filterData(e.target.checked, key)
                    setBodyData([]);
                    setCurrPage(0);
                  }
                  }
                  // className="ml-1"
                  style={{"margin-left":"10px"}}
                  disabled={loading}
                />
              </Col>
              </>
            )
          }
          if (key === "date_range") {
            return (
              <>
                <Col md={3}>
                  <label>From</label>
                  <input
                    onChange={(e) =>
                      setStartDate({
                        label: `${props.filter[key]}__gte`,
                        value: e.target.value,
                      })
                    }
                    type="date"
                    className="form-control"
                    disabled={loading}
                  />
                </Col>
                <Col md={3}>
                  <label>To</label>
                  <input
                    disabled={!startDate || loading}
                    onChange={(e) => {
                      setEndDate({
                        label: `${props.filter[key]}__lte`,
                        value: e.target.value,
                      });
                      setBodyData([]);
                      setCurrPage(0);
                    }}
                    min={startDate}
                    type="date"
                    className="form-control"
                  />
                </Col>
              </>
            );
          }
          if (key.split("_")[1] === "Single") {
            return (
              <>
                <Col md={3} className="mb-2">
                  <Form.Label className="text-capitalize">{key}</Form.Label>
                  <Select
                    label={key.split("_")[0]}
                    value={{
                      label: filter[key.split("_")[0]],
                      value: filter[key.split("_")[0]],
                    }}
                    onChange={(value) => {
                      filterData(value.value, key.split("_")[0]);
                      setBodyData([]);
                      setCurrPage(0);
                    }}
                    options={props.filter[key]}
                    isDisabled={loading}
                  />
                </Col>
              </>
            );
          }
          return (
            <Col md={3} className="mb-2">
              <Form.Label className="text-capitalize">{key}</Form.Label>
              <Select
                label={key}
                isMulti={true}
                value={filter[key]}
                onChange={(value) => {
                  filterData(value, key);
                  setBodyData([]);
                  setCurrPage(0);
                }}
                options={props.filter[key]}
                isDisabled={loading}
              />
            </Col>
          );
        })}

        {props.exportData && (
          <Col className="m-4" md={3}>
            <Button onClick={downloadExcel} disabled={loading}>
              Export to Excel
            </Button>
          </Col>
        )}
      </Row>

      <div
        className={`table-wrapper ${
          props.overflowHidden ? "overflow__hidden" : ""
        }`}
      >
        <>
          <table>
            {props.headData && props.renderHead && (
              <thead>
                <tr>
                  {props.headData.map((item, index) =>
                    props.renderHead(item, index)
                  )}
                </tr>
              </thead>
            )}

            {bodyData["page0"]?.length > 0 && (
              <tbody>
                {bodyData[`page${currPage}`]?.map((item, index) =>
                  props.renderBody(
                    item,
                    index + currPage * props.limit,
                    currPage
                  )
                )}
              </tbody>
            )}
          </table>
          {bodyHtml}
          {pages > 1 ? (
            <>
              <div className="table__pagination">
                Showing {currPage * props.limit + 1} -{" "}
                {!bodyData[`page${currPage}`]
                  ? null
                  : currPage * props.limit + bodyData[`page${currPage}`].length}
                &nbsp; of {totalLength} records &nbsp;
                <button
                  className="table__pagination-item"
                  onClick={() => selectPage(0)}
                >
                  {" "}
                  {`<<`}{" "}
                </button>
                <button
                  className="table__pagination-item"
                  onClick={() =>
                    selectPage(currPage === 0 ? currPage : currPage - 1)
                  }
                >
                  {" "}
                  {`<`}{" "}
                </button>
                <button
                  className="table__pagination-item"
                  onClick={() =>
                    selectPage(
                      currPage === range.length - 1 ? currPage : currPage + 1
                    )
                  }
                >
                  {`>`}
                </button>
                <button
                  className="table__pagination-item"
                  onClick={() => selectPage(range.length - 1)}
                >
                  {" "}
                  {`>>`}{" "}
                </button>
              </div>
            </>
          ) : null}
        </>
      </div>
    </div>
  );
};

export default Table;
