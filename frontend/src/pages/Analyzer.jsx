import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useCallback, useId } from "react";
import axios from "axios";
import { AuthContext } from "../Context/auth";

import { MonthlySummary } from "../components/Summary";
import SummaryPieChart from "../components/SummaryPieChart";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

import BasicDatePicker from "../components/DatePicker";

import {
  categoryData,
  expenseData,
  expenseMapping,
} from "../defaultData/inputFieldData";
import toast from "react-hot-toast";
import SideNav from "../components/HamburgerMenu";
import { MyExpensesInAnalyzer } from "../components/MyExpenses";

const Analyzer = () => {
  // to edit salary
  const [isEditable, setIsEditable] = useState(false); // Initialize edit state

  // auth context data
  const [auth, setAuth] = useContext(AuthContext);

  // user data
  const [userName, setUserName] = useState("");
  const [salary, setSalary] = useState(0);
  const [userId, setUserId] = useState(0);
  const [mySummary, setMySummary] = useState([]);
  const [healthInsurance, setHealthInsurance] = useState();
  const [TermInsurance, setTermInsurance] = useState();
  const [myAllExpenses, setMyAllExpenses] = useState();

  // selected options in form
  const [selectedExpense, setSelectedExpense] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [setlectedDate, setSetlectedDate] = useState(dayjs("2022-04-17"));
  const [NoOfUnit, setNoOfUnit] = useState(1);
  const [comment, setComment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // error message
  const [errorMessage, setErrorMessage] = useState("");

  // goToTop button
  const [showButton, setShowButton] = useState(false);

  const navigate = useNavigate();

  // to Add new expense
  const handleAddExpense = async (event, name, amount) => {
    try {
      // console.log("analyzer:", setlectedDate);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/actualExpenses`,
        {
          commodityName: selectedExpense,
          noOfUnit: NoOfUnit,
          cost: selectedAmount,
          comments: comment,
          purchasedAt: setlectedDate,
          user: userId,
        },
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        }
      );
      toast.success("Added successfully");
      window.location.reload();

      // console.log(data);
    } catch (err) {
      // console.log(err.message);
      toast.error(
        errorMessage.length ? err.message : "Fill all the required fileds!"
      );
    }
  };

  // To ensure amount <= remaining Money
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSelectedAmount(value);

    // console.log(value, saving);

    // Validate input value against currentMoney limit
    if (parseInt(value, 10) > salary) {
      setErrorMessage("You cannot exceed your current money limit.");
    } else {
      setErrorMessage("");
    }
  };

  // handle salary update
  const handleSalaryChange = async (event) => {
    setSalary(event.target.value);

    const { data } = await axios.patch(
      `${process.env.REACT_APP_API}/api/v1/users/${userId}`,
      {
        salaryAfterTax: event.target.value,
      }
    );
    // console.log(data);
  };

  //////////////////// handle user logout //////////////////////////////////
  const handleLogout = async () => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;

    setAuth({
      token: "",
    });

    toast.success("Logout successfully");

    navigate("/");
    window.location.reload();
  };

  //////////////////// Page scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // function to decrement number of units
  const decrement = () => {
    if (NoOfUnit > 1) {
      setNoOfUnit(NoOfUnit - 1);
    }
  };

  // function to increment number of units
  const increment = () => {
    setNoOfUnit(NoOfUnit + 1);
  };

  // Handle scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // to intialize monthly Summary data
  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/actualExpenses`,
          {
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
            params: {
              user: userId,
            },
          }
        );
        // console.log(data);
        setMySummary(data);
      } catch (err) {
        // console.error(err);
      }
    };

    fetchAllExpenses();
  }, [userId]);

  // to get userId, name and salary
  useEffect(() => {
    // Decode user ID from JWT token
    const decodedToken = jwtDecode(auth.token);
    setUserId(decodedToken.id);

    // get user name
    const fetchUserbyId = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/users/${decodedToken.id}`
        );

        setSalary(data?.data?.user?.salaryAfterTax);

        setUserName(data?.data?.user?.name);

        // SET INSURANCE
        Object.entries(data?.data?.user?.expenses).forEach(([key, value]) => {
          // console.log(value);
          if (value.item === "health-insurance") {
            setHealthInsurance(value.monthly * 12);
          }
          if (value.item === "term-insurance") {
            setTermInsurance(value.monthly * 12);
          }
        });
      } catch (err) {
        // console.log(err);
      }
    };

    fetchUserbyId();

    // Handle scroll button visibility
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch all expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/actualExpenses`,
          {
            headers: {
              authorization: `Bearer ${auth?.token}`,
            },
            params: {
              user: userId,
            },
          }
        );
        console.log(data?.data?.expenses[0]);
        setMyAllExpenses(data?.data?.expenses);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="container mx-auto min-h-screen bg-[#000] px-4 py-8 rounded-lg shadow-md">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-4 bg-[#4D3C77] bg-opacity-80 fixed top-0 left-0 right-0 z-10 px-4 py-2">
        <SideNav />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <img src="/images/mainIcon.png" width={32} alt="" />
            <h1 className="text-2xl font-semibold text-white ml-4">
              Budget Analyzer
            </h1>
          </div>
          <div className="flex items-center ml-auto">
            <h3 className="text-sm font-semibold text-white mr-2">Salary :</h3>
            <div className="relative border-solid border-2 border-black rounded-lg">
              <input
                type="number"
                className="w-32 h-8 rounded-md px-2 focus:outline-none"
                value={salary}
                onChange={handleSalaryChange}
                readOnly={!isEditable}
              />
              <button
                className="absolute right-0 mt-0 bg-[#fff] text-white rounded-r-md h-full"
                onClick={() => {
                  setIsEditable(!isEditable);
                }}
              >
                {isEditable ? (
                  <img
                    src="/images/save.png"
                    alt="Save Button"
                    style={{ width: "32px", height: "32px" }}
                  />
                ) : (
                  <img
                    src="/images/edit.png"
                    alt="Edit Button"
                    style={{ width: "32px", height: "32px" }}
                  />
                )}
              </button>
            </div>

            <div className="relative border-solid border-2 border-black rounded-lg mx-4 bg-white">
              <p className="w-28 ml-4 mr-4 py-1">{userName}</p>
              <button
                className="absolute inset-y-0 right-0 px-2 py-0 bg-[#FF3E58] text-white rounded-r-md h-full"
                onClick={handleLogout}
              >
                <img
                  src="/images/logout.png"
                  alt="Edit Button"
                  style={{ width: "32px", height: "32px", marginTop: "0px" }}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="mainContent flex-wrap pt-16 flex flex-col gap-24 md:flex-row items-center justify-center md:my-16">
        <div className="expenseAdder bg-[#0F0F0F] rounded-lg p-4 shadow-md mb-4 w-full md:w-[40%] md:mr-8 md:mb-0 md:ml-8">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
            Add Expense
          </h2>

          <div className="flex items-center">
            {/* Expense selector */}
            <div className="flex-grow mr-2">
              <input
                type="text"
                placeholder="Commodity/Service"
                className="mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full"
                value={selectedExpense}
                onChange={(e) => setSelectedExpense(e.target.value)}
              />
            </div>

            {/* Counter */}
            <div className="flex items-center mb-[-16px]">
              <button
                type="button"
                id="decrement-button"
                data-input-counter-decrement="quantity-input"
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-l-lg p-2.5 h-10 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                onClick={decrement}
              >
                <svg
                  className="w-3 h-3 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 2"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h16"
                  />
                </svg>
              </button>
              <input
                type="text"
                id="quantity-input"
                value={NoOfUnit}
                onChange={(e) => setNoOfUnit(e.target.value)}
                aria-describedby="helper-text-explanation"
                className="bg-gray-50 border border-gray-300 h-10 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-16 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0"
                required
              />
              <button
                type="button"
                id="increment-button"
                data-input-counter-increment="quantity-input"
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-r-lg p-2.5 h-10 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                onClick={increment}
              >
                <svg
                  className="w-3 h-3 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <input
            type="number"
            placeholder="total amount"
            className="mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full"
            onChange={handleInputChange}
            value={selectedAmount}
          />

          <input
            type="text"
            placeholder="comment"
            className="mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <BasicDatePicker
            setlectedDate={setlectedDate}
            setSetlectedDate={setSetlectedDate}
          />

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <button
            onClick={() => handleAddExpense(selectedExpense, selectedAmount)} // Example values, replace with actual data input
            className="mt-4 px-4 py-2 bg-[#4D3C77] text-white rounded-md block w-full"
            disable={(
              selectedExpense == null ||
              selectedAmount == null ||
              errorMessage.length
            ).toString()}
          >
            Add
          </button>
        </div>

        {/* INFO card */}
        <div className="glassmorphic flex flex-col gap-1 justify-around rounded-lg p-4 text-white shadow-md mb-4 w-full md:w-[24%] md:mr-8 md:mb-0 md:ml-8 h-52 backdrop-filter backdrop-blur-lg bg-opacity-30 bg-white border border-white/10">
          <div className="flex justify-between w-full p-2 rounded-lg relative">
            <div className="flex items-center">
              <h1 className="font-bold text-sm">Inflation</h1>
              <div className="tooltip">
                <img
                  src="/images/info.png"
                  alt="info"
                  className="ml-2 w-3 h-3"
                />
                <span className="tooltip-text">
                  Always keep inflation in mind when planning your budget.
                  <a
                    target="_blank"
                    href="https://www.investopedia.com/articles/insights/122016/9-common-effects-inflation.asp"
                  >
                    <span className="text-[#0000ba]">Learn more.</span>
                  </a>
                </span>
              </div>
            </div>
            <span>0.52 %</span>
          </div>

          <div className="flex justify-between w-full p-2 rounded-lg relative">
            <div className="flex items-center">
              <h1 className="font-bold text-sm">Emergency fund (suggested)</h1>
              <div className="tooltip">
                <img
                  src="/images/info.png"
                  alt="info"
                  className="ml-2 w-3 h-3"
                />
                <span className="tooltip-text">
                  Emergency fund should be at least 6 times of your monthly
                  salary.
                  <a
                    target="_blank"
                    href="https://www.investopedia.com/terms/e/emergency_fund.asp"
                  >
                    <span className="text-[#0000ba]">Learn more.</span>
                  </a>
                </span>
              </div>
            </div>
            <span>₹{salary / 2}</span>
          </div>

          <div className="flex justify-between w-full p-2 rounded-lg relative">
            <div className="flex items-center">
              <h1 className="font-bold text-sm">Health Insurance</h1>
              <div className="tooltip">
                <img
                  src="/images/info.png"
                  alt="info"
                  className="ml-2 w-3 h-3"
                />
                <span className="tooltip-text">
                  Ideal health insurance should be 200 times room rent in
                  hospital.{" "}
                  <a
                    target="_blank"
                    href="https://www.investopedia.com/terms/h/healthinsurance.asp"
                  >
                    <span className="text-[#0000ba]">Learn more.</span>
                  </a>
                </span>
              </div>
            </div>
            <span>₹ {healthInsurance}</span>
          </div>

          <div className="flex justify-between w-full p-2 rounded-lg relative">
            <div className="flex items-center">
              <h1 className="font-bold text-sm">Term Insurance</h1>
              <div className="tooltip">
                <img
                  src="/images/info.png"
                  alt="info"
                  className="ml-2 w-3 h-3"
                />
                <span className="tooltip-text">
                  Term insurance is not market-linked and provides pure
                  protection. Ideally, coverage should range between 10 to 15
                  times your annual salary{" "}
                  <a
                    target="_blank"
                    href="https://www.investopedia.com/terms/t/termlife.asp"
                  >
                    <span className="text-[#0000ba]">Learn more.</span>
                  </a>
                </span>
              </div>
            </div>
            <span>₹ {TermInsurance}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex-wrap pt-16 flex flex-col md:flex-row items-center justify-center md:my-16">
        <div className="bg-[#0F0F0F] rounded-lg p-4 shadow-md mb-4 w-full md:w-[100%] md:mr-8 md:mb-0 md:ml-8">
          <MonthlySummary
            mySummary={mySummary}
            salary={salary}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </div>
      </div>

      {/* MY ALL EXPENSE COMPONENT */}
      {myAllExpenses && (
        <MyExpensesInAnalyzer
          myAllExpenses={myAllExpenses}
          userSalary={salary}
        />
      )}

      {/* SCROLL TO TOP BUTTON */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-6 bg-neutral-50 bg-opacity-80 p-3 rounded-full shadow-lg"
        >
          <img src="/images/top.png" height={16} width={16} />
        </button>
      )}
    </div>
  );
};

export default Analyzer;
