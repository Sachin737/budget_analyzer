import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useCallback, useId } from "react";
import axios from "axios";
import { AuthContext } from "../Context/auth";
import { UserDataContext } from "../Context/userData";

import MyExpenses from "../components/MyExpenses";
import Summary from "../components/Summary";
import SummaryPieChart from "../components/SummaryPieChart";
import { jwtDecode } from "jwt-decode";

import {
  categoryData,
  expenseData,
  expenseMapping,
} from "../defaultData/inputFieldData";
import toast from "react-hot-toast";

const Analyzer = () => {
  // to edit salary
  const [isEditable, setIsEditable] = useState(false); // Initialize edit state

  // auth context data
  const [auth, setAuth] = useContext(AuthContext);

  // user context data
  const {
    userName,
    setUserName,
    salary,
    setSalary,
    userId,
    setUserId,
    investment,
    setInvestment,
    expense,
    setExpense,
    saving,
    setSaving,
  } = useContext(UserDataContext);

  // all options
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);

  // list of all expenses (for user)
  const [myAllExpenses, setMyAllExpenses] = useState([]);
  const [mySummary, setMySummary] = useState([]);

  // selected options in form
  const [selectedExpense, setSelectedExpense] = useState("");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);

  // error message
  const [errorMessage, setErrorMessage] = useState("");

  const [showButton, setShowButton] = useState(false);

  // number of unit state
  const [NoOfUnit, setNoOfUnit] = useState(0);

  const navigate = useNavigate();

  // to Add new expense
  const handleAddExpense = async (event, name, amount) => {
    try {
      
    } catch (err) {
      toast.error("Fill all required fields!");
    }
  };

  // To ensure amount <= remaining Money
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSelectedAmount(value);

    console.log(value, saving);

    // Validate input value against currentMoney limit
    if (parseInt(value * 12, 10) > saving) {
      setErrorMessage("You cannot exceed your current money limit.");
    } else {
      setErrorMessage("");
    }
  };

  // handle salary update
  const handleSalaryChange = (event) => {
    setSalary(event.target.value);
  };

  // handle user logout
  const handleLogout = async () => {
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    toast.success("Logout successfully");
    navigate("/");
    window.location.reload();
  };

  // Page scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // function to decrement number of units
  const decrement = () => {
    if (NoOfUnit > 0) {
      setNoOfUnit(NoOfUnit - 1);
    }
  };

  // function to increment number of units
  const increment = () => {
    setNoOfUnit(NoOfUnit + 1);
  };

  useEffect(() => {
    console.log("analyzer: ",salary, expense, investment, userName, userId);

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
  });

  // // to get all options in add Expense form
  useEffect(() => {
    setCategoryTypes(categoryData);
    setExpenseTypes(expenseData);
  }, [userId]);


  // to get userId and name
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

        // console.log(data.data.user);
        setUserName(data?.data?.user?.name);
      } catch (err) {
        console.log(err);
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
  });

  return (
    <div className="container mx-auto min-h-screen bg-[#000] px-4 py-8 rounded-lg shadow-md">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-4 bg-[#4D3C77] bg-opacity-80 fixed top-0 left-0 right-0 z-10 px-4 py-2">
        <h1 className="text-2xl font-semibold text-white">Budget Analyzer</h1>
        <div className="flex items-center">
          <h3 className="text-sm font-semibold text-white mr-2 mr-1">
            Salary :
          </h3>
          <div className="relative border-solid border-2 border-black rounded-lg">
            <input
              type="number"
              className="w-36 h-8 rounded-md px-2 py-1  focus:outline-none"
              value={salary}
              onChange={handleSalaryChange}
              readOnly={!isEditable}
            />
            <button
              className="absolute inset-y-0 right-0 px-2 py-0 bg-[#000] text-white rounded-r-md h-full"
              onClick={() => {
                setIsEditable(!isEditable);
              }}
            >
              {isEditable ? "Save" : "Edit"}
            </button>
          </div>

          <div className="relative border-solid border-2 border-black rounded-lg mx-4 bg-white">
            <p className="w-32 ml-4 mr-4 py-1">{userName}</p>
            <button
              className="absolute inset-y-0 right-0 px-2 py-0 bg-[#FF3E58] text-white rounded-r-md h-full"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="mainContent pt-16 flex flex-col md:flex-row items-center justify-center md:my-16">
        <div className="expenseAdder bg-[#0F0F0F] rounded-lg p-4 shadow-md mb-4 w-full md:w-[40%] md:mr-8 md:mb-0 md:ml-8">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
            Add Expense
          </h2>

          <select
            value={selectedExpenseCategory}
            onChange={(e) => {
              setSelectedExpenseCategory(e.target.value);
              // Reset selectedExpense when the category changes
              setSelectedExpense("");
            }}
            className="mb-4 mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full"
          >
            <option value="">Category</option>
            {categoryTypes &&
              categoryTypes.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
          </select>

          <div className="flex items-center">
            {/* Expense selector */}
            <div className="flex-grow mr-2">
              <select
                value={selectedExpense}
                onChange={(e) => setSelectedExpense(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 w-full"
              >
                <option value="">Commodity Name</option>
                {Object.entries(expenseMapping)
                  .filter(([key, value]) => value === selectedExpenseCategory)
                  .map(([expense, typeOfExpense], index) => (
                    <option key={index} value={expense}>
                      {expense}
                    </option>
                  ))}
              </select>
            </div>

            {/* Counter */}
            <div className="flex items-center">
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
            placeholder="Amount"
            className="mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full"
            onChange={handleInputChange}
            value={selectedAmount}
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

        <div className="w-full md:w-[40%] md:mr-8 md:mb-0 md:ml-8">
          <img src="/images/analyzer.png" alt="budget analyzer image" />
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
