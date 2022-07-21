import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import ReactSelect from "react-select";
import { useParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const projectTypeOptions = [
  "BP",
  "FM",
  "PD",
  "BP + FM",
  "BP + PD",
  "FM + PD",
  "BP + FM + PD",
  "legal contract",
  "assignment",
  "company profile",
  "presentation",
  "other graphics",
  "SOP + Policies",
  "bookkeeping",
  "excel tamplets",
  "market research",
  "market plan",
  "proposal",
];

var currency_list = [
  { name: "Afghan Afghani", code: "AFA" },
  { name: "Albanian Lek", code: "ALL" },
  { name: "Algerian Dinar", code: "DZD" },
  { name: "Angolan Kwanza", code: "AOA" },
  { name: "Argentine Peso", code: "ARS" },
  { name: "Armenian Dram", code: "AMD" },
  { name: "Aruban Florin", code: "AWG" },
  { name: "Australian Dollar", code: "AUD" },
  { name: "Azerbaijani Manat", code: "AZN" },
  { name: "Bahamian Dollar", code: "BSD" },
  { name: "Bahraini Dinar", code: "BHD" },
  { name: "Bangladeshi Taka", code: "BDT" },
  { name: "Barbadian Dollar", code: "BBD" },
  { name: "Belarusian Ruble", code: "BYR" },
  { name: "Belgian Franc", code: "BEF" },
  { name: "Belize Dollar", code: "BZD" },
  { name: "Bermudan Dollar", code: "BMD" },
  { name: "Bhutanese Ngultrum", code: "BTN" },
  { name: "Bitcoin", code: "BTC" },
  { name: "Bolivian Boliviano", code: "BOB" },
  { name: "Bosnia-Herzegovina Convertible Mark", code: "BAM" },
  { name: "Botswanan Pula", code: "BWP" },
  { name: "Brazilian Real", code: "BRL" },
  { name: "British Pound Sterling", code: "GBP" },
  { name: "Brunei Dollar", code: "BND" },
  { name: "Bulgarian Lev", code: "BGN" },
  { name: "Burundian Franc", code: "BIF" },
  { name: "Cambodian Riel", code: "KHR" },
  { name: "Canadian Dollar", code: "CAD" },
  { name: "Cape Verdean Escudo", code: "CVE" },
  { name: "Cayman Islands Dollar", code: "KYD" },
  { name: "CFA Franc BCEAO", code: "XOF" },
  { name: "CFA Franc BEAC", code: "XAF" },
  { name: "CFP Franc", code: "XPF" },
  { name: "Chilean Peso", code: "CLP" },
  { name: "Chinese Yuan", code: "CNY" },
  { name: "Colombian Peso", code: "COP" },
  { name: "Comorian Franc", code: "KMF" },
  { name: "Congolese Franc", code: "CDF" },
  { name: "Costa Rican ColÃ³n", code: "CRC" },
  { name: "Croatian Kuna", code: "HRK" },
  { name: "Cuban Convertible Peso", code: "CUC" },
  { name: "Czech Republic Koruna", code: "CZK" },
  { name: "Danish Krone", code: "DKK" },
  { name: "Djiboutian Franc", code: "DJF" },
  { name: "Dominican Peso", code: "DOP" },
  { name: "East Caribbean Dollar", code: "XCD" },
  { name: "Egyptian Pound", code: "EGP" },
  { name: "Eritrean Nakfa", code: "ERN" },
  { name: "Estonian Kroon", code: "EEK" },
  { name: "Ethiopian Birr", code: "ETB" },
  { name: "Euro", code: "EUR" },
  { name: "Falkland Islands Pound", code: "FKP" },
  { name: "Fijian Dollar", code: "FJD" },
  { name: "Gambian Dalasi", code: "GMD" },
  { name: "Georgian Lari", code: "GEL" },
  { name: "German Mark", code: "DEM" },
  { name: "Ghanaian Cedi", code: "GHS" },
  { name: "Gibraltar Pound", code: "GIP" },
  { name: "Greek Drachma", code: "GRD" },
  { name: "Guatemalan Quetzal", code: "GTQ" },
  { name: "Guinean Franc", code: "GNF" },
  { name: "Guyanaese Dollar", code: "GYD" },
  { name: "Haitian Gourde", code: "HTG" },
  { name: "Honduran Lempira", code: "HNL" },
  { name: "Hong Kong Dollar", code: "HKD" },
  { name: "Hungarian Forint", code: "HUF" },
  { name: "Icelandic KrÃ³na", code: "ISK" },
  { name: "Indian Rupee", code: "INR" },
  { name: "Indonesian Rupiah", code: "IDR" },
  { name: "Iranian Rial", code: "IRR" },
  { name: "Iraqi Dinar", code: "IQD" },
  { name: "Israeli New Sheqel", code: "ILS" },
  { name: "Italian Lira", code: "ITL" },
  { name: "Jamaican Dollar", code: "JMD" },
  { name: "Japanese Yen", code: "JPY" },
  { name: "Jordanian Dinar", code: "JOD" },
  { name: "Kazakhstani Tenge", code: "KZT" },
  { name: "Kenyan Shilling", code: "KES" },
  { name: "Kuwaiti Dinar", code: "KWD" },
  { name: "Kyrgystani Som", code: "KGS" },
  { name: "Laotian Kip", code: "LAK" },
  { name: "Latvian Lats", code: "LVL" },
  { name: "Lebanese Pound", code: "LBP" },
  { name: "Lesotho Loti", code: "LSL" },
  { name: "Liberian Dollar", code: "LRD" },
  { name: "Libyan Dinar", code: "LYD" },
  { name: "Lithuanian Litas", code: "LTL" },
  { name: "Macanese Pataca", code: "MOP" },
  { name: "Macedonian Denar", code: "MKD" },
  { name: "Malagasy Ariary", code: "MGA" },
  { name: "Malawian Kwacha", code: "MWK" },
  { name: "Malaysian Ringgit", code: "MYR" },
  { name: "Maldivian Rufiyaa", code: "MVR" },
  { name: "Mauritanian Ouguiya", code: "MRO" },
  { name: "Mauritian Rupee", code: "MUR" },
  { name: "Mexican Peso", code: "MXN" },
  { name: "Moldovan Leu", code: "MDL" },
  { name: "Mongolian Tugrik", code: "MNT" },
  { name: "Moroccan Dirham", code: "MAD" },
  { name: "Mozambican Metical", code: "MZM" },
  { name: "Myanmar Kyat", code: "MMK" },
  { name: "Namibian Dollar", code: "NAD" },
  { name: "Nepalese Rupee", code: "NPR" },
  { name: "Netherlands Antillean Guilder", code: "ANG" },
  { name: "New Taiwan Dollar", code: "TWD" },
  { name: "New Zealand Dollar", code: "NZD" },
  { name: "Nicaraguan CÃ³rdoba", code: "NIO" },
  { name: "Nigerian Naira", code: "NGN" },
  { name: "North Korean Won", code: "KPW" },
  { name: "Norwegian Krone", code: "NOK" },
  { name: "Omani Rial", code: "OMR" },
  { name: "Pakistani Rupee", code: "PKR" },
  { name: "Panamanian Balboa", code: "PAB" },
  { name: "Papua New Guinean Kina", code: "PGK" },
  { name: "Paraguayan Guarani", code: "PYG" },
  { name: "Peruvian Nuevo Sol", code: "PEN" },
  { name: "Philippine Peso", code: "PHP" },
  { name: "Polish Zloty", code: "PLN" },
  { name: "Qatari Rial", code: "QAR" },
  { name: "Romanian Leu", code: "RON" },
  { name: "Russian Ruble", code: "RUB" },
  { name: "Rwandan Franc", code: "RWF" },
  { name: "Salvadoran ColÃ³n", code: "SVC" },
  { name: "Samoan Tala", code: "WST" },
  { name: "Saudi Riyal", code: "SAR" },
  { name: "Serbian Dinar", code: "RSD" },
  { name: "Seychellois Rupee", code: "SCR" },
  { name: "Sierra Leonean Leone", code: "SLL" },
  { name: "Singapore Dollar", code: "SGD" },
  { name: "Slovak Koruna", code: "SKK" },
  { name: "Solomon Islands Dollar", code: "SBD" },
  { name: "Somali Shilling", code: "SOS" },
  { name: "South African Rand", code: "ZAR" },
  { name: "South Korean Won", code: "KRW" },
  { name: "Special Drawing Rights", code: "XDR" },
  { name: "Sri Lankan Rupee", code: "LKR" },
  { name: "St. Helena Pound", code: "SHP" },
  { name: "Sudanese Pound", code: "SDG" },
  { name: "Surinamese Dollar", code: "SRD" },
  { name: "Swazi Lilangeni", code: "SZL" },
  { name: "Swedish Krona", code: "SEK" },
  { name: "Swiss Franc", code: "CHF" },
  { name: "Syrian Pound", code: "SYP" },
  { name: "São Tomé and Príncipe Dobra", code: "STD" },
  { name: "Tajikistani Somoni", code: "TJS" },
  { name: "Tanzanian Shilling", code: "TZS" },
  { name: "Thai Baht", code: "THB" },
  { name: "Tongan Pa'anga", code: "TOP" },
  { name: "Trinidad & Tobago Dollar", code: "TTD" },
  { name: "Tunisian Dinar", code: "TND" },
  { name: "Turkish Lira", code: "TRY" },
  { name: "Turkmenistani Manat", code: "TMT" },
  { name: "Ugandan Shilling", code: "UGX" },
  { name: "Ukrainian Hryvnia", code: "UAH" },
  { name: "United Arab Emirates Dirham", code: "AED" },
  { name: "Uruguayan Peso", code: "UYU" },
  { name: "US Dollar", code: "USD" },
  { name: "Uzbekistan Som", code: "UZS" },
  { name: "Vanuatu Vatu", code: "VUV" },
  { name: "Venezuelan BolÃvar", code: "VEF" },
  { name: "Vietnamese Dong", code: "VND" },
  { name: "Yemeni Rial", code: "YER" },
  { name: "Zambian Kwacha", code: "ZMK" },
];

const AddProject = () => {
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({
    hasRecruiter: false,
    totalAmount: 0,
    status: "new",
    awardedAt: new Date(),
  });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [assignee, setAssignee] = useState([]);
  const { userInfo } = useSelector((state) => state.userLogin);

  // invoice calculation states
  const [netRecieveable, setNetRecieveable] = useState(0);
  const [amountDeducted, setAmountDeducted] = useState(0);

  // dropdown options
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);

  // behavior states
  const [revertState, setRevertState] = useState(null);
  const [editAble, setEditAble] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const history = useHistory();

  const { id } = useParams();
  console.log(!id);
  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;

    if (name === "profile") {
      setSelectedProfile(profiles.find((pro) => pro._id === value));
    }
    if (name === "status") {
      // remove assigne & set closed at
      if (value === "closed") {
        setAssignee([]);
        setState((prev) => ({ ...prev, closedAt: new Date() }));
      } else {
        setState((prev) => {
          const temp = prev;
          delete temp.closedAt;
          delete temp.empShare;
          delete temp.netRecieveable;
          delete temp.amountRecieved;
          return temp;
        });
      }
    }
    if (name === "hasRecruiter") {
      setState((prev) => {
        return {
          ...prev,
          hasRecruiter: !state.hasRecruiter,
        };
      });
    } else {
      setState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const changeAssignee = (value) => {
    if (value.length !== 0 && state.status === "new") {
      setState((prev) => ({ ...prev, status: "open" }));
    }
    setAssignee(value);
  };

  // set values
  useEffect(() => {
    const populateForm = async () => {
      const profileRes = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/profiles/1000/0`,
        {
          bidder: userInfo.role !== "admin" && userInfo._id,
        }
      );
      var tempProfiles = profileRes.data.data;

      const userRes = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/1000/0`
      );
      setUsers(
        userRes.data.data.map((user) => {
          return {
            value: user._id,
            label: user.userName,
          };
        })
      );

      if (id) {
        const projectRes = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`
        );

        const tempProject = projectRes.data;

        setSelectedProfile(tempProject.profile);
        setIsClosed(tempProject.status === "closed");

        // if it is not user's project don't show profile options
        const isMyProject = tempProfiles.some(
          (p) => p._id === tempProject.profile._id
        );
        if (!isMyProject && userInfo.role !== "admin") {
          tempProfiles = [tempProject.profile];
        }
        tempProject.profile = tempProject.profile._id;
        setState((prev) => ({ ...prev, ...tempProject }));
      } else {
        setEditAble(true);
      }
      setProfiles(tempProfiles);
    };

    populateForm().then(() => setLoading(false));
  }, [id, userInfo._id, userInfo.role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }
    if (state.exchangeRate === 0) {
      return toast.error("Please Enter Valid Exchange rate");
    }

    state.assignee = assignee.map((item) => item.value);

    if (id) {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
        state
      );
      if (res.status === 200) {
        toast.success("Project Updated Successfully");
        setEditAble(false);
      }
    } else {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/projects/`,
        state
      );
      if (res.status === 201) {
        toast.success("Project Created Successfully");
        history.push("/projects");
      }
    }
  };

  // calculate amount deducted
  // calculate amount recieved and employee share
  useEffect(() => {
    let amtDec = 0;
    let netRec = 0;
    let platformFee;
    if (selectedProfile?.platform === "freelancer") {
      platformFee = 0.1;
    } else if (selectedProfile?.platform === "fiver") {
      platformFee = 0.2;
    } else if (selectedProfile?.platform === "upwork") {
      if (state.totalAmount <= 500) {
        platformFee = 0.2;
      } else {
        let moreThanFive = state.totalAmount - 500;
        amtDec = moreThanFive * 0.1 + 100;
      }
    }
    if (amtDec === 0) {
      var recruiterFee = 0.05;
      if (state.hasRecruiter) {
        if (state.status === "closed") {
          amtDec = (platformFee + recruiterFee) * state.totalAmount;
        } else {
          amtDec = 0;
        }
      } else {
        amtDec = platformFee * state.totalAmount;
      }
    }
    netRec = state.totalAmount - amtDec;
    setAmountDeducted(Math.round(amtDec * 100) / 100);
    setNetRecieveable(netRec);

    if (state.status === "closed") {
      setState((prev) => {
        let share = selectedProfile
          ? (selectedProfile.share / 100) * prev.totalAmount
          : 0;
        return {
          ...prev,
          empShare: share * state.exchangeRate,
          amountRecieved: netRec * state.exchangeRate,
        };
      });
    }
  }, [
    state.status,
    state.totalAmount,
    selectedProfile,
    state.hasRecruiter,
    state.exchangeRate,
  ]);
  return (
    <Card>
      <Card.Header className="text-center">
        <h1>Project Detail</h1>
      </Card.Header>
      {loading ? (
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
      ) : (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="my-2 mx-3">
            <Row className="my-2">
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Title
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  readOnly={!editAble}
                  name="title"
                  onChange={handleChange}
                  type="text"
                  value={state.title ?? ""}
                  placeholder="Enter title"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Profile
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  readOnly={!editAble || isClosed}
                  as="select"
                  name="profile"
                  onChange={(value) => {
                    if (editAble && !isClosed) handleChange(value);
                  }}
                  value={state.profile ?? ""}
                  required
                >
                  <option key="initial" value="">
                    Select-Profile
                  </option>
                  {profiles.map((profile, index) => {
                    return (
                      <option key={index} value={profile._id}>
                        {profile.title} {profile.platform}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Assignee</Form.Label>
                <ReactSelect
                  defaultValue={
                    state.assignee
                      ? state.assignee.map((item) => {
                          return { value: item._id, label: item.userName };
                        })
                      : []
                  }
                  isMulti
                  name="assignee"
                  options={users}
                  onChange={changeAssignee}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isDisabled={!editAble || isClosed}
                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} md="4">
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  readOnly={!editAble}
                  type="text"
                  value={state.clientName ?? ""}
                  placeholder="Client Name"
                  name="clientName"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Client Country</Form.Label>
                <Form.Control
                  readOnly={!editAble}
                  type="text"
                  value={state.clientCountry ?? ""}
                  placeholder="Client Country"
                  name="clientCountry"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>
                  Project Type
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  readOnly={!editAble || isClosed}
                  as="select"
                  name="projectType"
                  onChange={(value) => {
                    if (editAble && !isClosed) handleChange(value);
                  }}
                  value={state.projectType ?? ""}
                  required
                >
                  <option key="initial" value="">
                    Select Project Type
                  </option>
                  {projectTypeOptions.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} md="4">
                <Form.Label>
                  Status
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </Form.Label>
                <Form.Control
                  readOnly={!editAble || isClosed}
                  as="select"
                  name="status"
                  onChange={(value) => {
                    if (editAble) {
                      handleChange(value);
                    }
                  }}
                  value={state.status}
                  required
                >
                  {assignee?.length === 0 && <option value="new">New</option>}
                  <option value="open">Open</option>
                  <option value="underreview">Underreview</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="closed">Closed</option>
                </Form.Control>
              </Form.Group>
            </Row>

            <Row className="mt-3 ml-3 align-items-center">
              <Form.Group className="mt-4" as={Col} md="2">
                <Form.Check
                  type="checkbox"
                  name="hasRecruiter"
                  checked={state.hasRecruiter ?? false}
                  label={`Has Recruiter`}
                  onChange={(value) => {
                    if (editAble && !isClosed) handleChange(value);
                  }}
                />
              </Form.Group>
              {state.hasRecruiter && (
                <Form.Group as={Col} md="4">
                  <Form.Label>Recruiter Name</Form.Label>
                  <Form.Control
                    readOnly={!editAble}
                    type="text"
                    placeholder="Recruiter Name"
                    name="recruiterName"
                    onChange={handleChange}
                    value={state.recruiterName ?? ""}
                  />
                </Form.Group>
              )}
            </Row>
            <hr className="my-5" />
            {(userInfo.role === "admin" || userInfo.isManager || !id) && (
              <>
                <Row className="my-2">
                  <Form.Group as={Col} md="2">
                    <Form.Label>
                      Total Amount
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        *
                      </span>
                    </Form.Label>
                    <Form.Control
                      readOnly={!editAble || isClosed}
                      type="number"
                      placeholder="Total Amount"
                      name="totalAmount"
                      value={state.totalAmount ?? 0}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>
                      Currency
                      <span
                        style={{
                          color: "red",
                        }}
                      >
                        *
                      </span>
                    </Form.Label>
                    <Form.Control
                      readOnly={!editAble || isClosed}
                      as="select"
                      name="currency"
                      onChange={(value) => {
                        if (editAble && !isClosed) handleChange(value);
                      }}
                      value={state.currency ?? ""}
                      required
                    >
                      <option key="initial" value="">
                        Select Currency
                      </option>
                      {currency_list.map((item, index) => (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  {state.status === "closed" && (
                    <Form.Group as={Col} md="3">
                      <Form.Label>Exchange Rate</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Exchange Rate"
                        min={0}
                        readOnly={!editAble}
                        value={state.exchangeRate ?? null}
                        name="exchangeRate"
                        required={state.status === "closed"}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  )}
                </Row>
                <Row>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Amount Deducted</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="-"
                      name="amountDeducted"
                      value={amountDeducted}
                      readOnly
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Net Recieveable</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="-"
                      readOnly
                      value={netRecieveable}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="3">
                    <Form.Label>Amount Recieved</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="-"
                      value={state.amountRecieved ?? null}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="3">
                    <Form.Label>Employee Share</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="-"
                      readOnly
                      value={state.empShare ?? null}
                    />
                  </Form.Group>
                </Row>
                <br />
                <hr className="my-5" />
              </>
            )}
            <Row className="my-2">
              <Form.Group as={Col} md="4">
                <Form.Label>Awarded At</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Awarded At"
                  value={moment(state.awardedAt).format("YYYY-MM-DD")}
                  name="awardedAt"
                  onChange={handleChange}
                  required
                  readOnly={!editAble}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Closed At</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    state.closedAt
                      ? moment(state.closedAt).format("YYYY-MM-DD")
                      : ""
                  }
                  placeholder="Closed At"
                  name="closedAt"
                  onChange={handleChange}
                  readOnly={!editAble}
                />
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label>Deadline At</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Deadline At"
                  value={
                    state.deadlineAt
                      ? moment(state.deadlineAt).format("YYYY-MM-DD")
                      : ""
                  }
                  name="deadlineAt"
                  onChange={handleChange}
                  readOnly={!editAble}
                />
              </Form.Group>
            </Row>
          </Row>

          {!id ? (
            <Button
              disabled={loading}
              className="p-2 m-3"
              variant="success"
              md={3}
              type="submit"
            >
              {loading && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              Create
            </Button>
          ) : userInfo.role === "user" && !userInfo.isManager ? (
            <></>
          ) : !editAble ? (
            <Button
              className="p-2 m-3"
              variant="outline-primary"
              md={3}
              onClick={() => {
                setRevertState(state);
                setEditAble(true);
              }}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className="p-2 m-3"
                variant="success"
                md={3}
                disabled={loading}
                type="submit"
              >
                {loading && (
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Save
              </Button>
              <Button
                className="p-2 m-3"
                md={3}
                variant="outline-danger"
                onClick={() => {
                  setState(revertState);
                  setValidated(false);
                  setEditAble(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Form>
      )}
    </Card>
  );
};

export default AddProject;
