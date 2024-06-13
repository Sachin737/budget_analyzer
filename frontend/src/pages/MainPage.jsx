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
import { Spinner } from "../components/Spinner";

import {
  categoryData,
  expenseData,
  expenseMapping,
} from "../defaultData/inputFieldData";
import toast from "react-hot-toast";

function MainPage() {
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

  const navigate = useNavigate();

  // to Add new expense
  const handleAddExpense = async (event, name, amount) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/expenses`,
        {
          typeOfExpense: selectedExpenseCategory,
          item: selectedExpense,
          monthly: selectedAmount,
          user: userId,
        },
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        }
      );

      {
        // get updated summary
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/users/${userId}`
        );

        // Converting mothly summary to yearly summary and updating total expense
        let sm = 0;
        let tempSummary = data?.data?.user?.summary;

        if (tempSummary.length > 0) {
          Object.entries(tempSummary[0]).forEach(([category, value]) => {
            if (
              !(
                category === "user" ||
                category === "__v" ||
                category === "_id" ||
                category === "id"
              )
            ) {
              if (category !== "investment_outflows") sm += 12 * value;
              tempSummary[0][category] *= 12;
            }
          });
        }

        // updating investment contribution
        if (tempSummary.length) {
          setMySummary(data?.data?.user?.summary[0]);
          setInvestment(data?.data?.user?.summary[0].investment_outflows);
        } else {
          setInvestment(0);
        }

        // updating expense
        setExpense(sm);

        // updating myAll expenses
        setMyAllExpenses(data?.data?.user?.expenses);
      }
    } catch (err) {
      toast.error("Fill all required fields!");
    }
  };

  // To ensure amount <= remaining Money
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSelectedAmount(value);

    // Validate input value against currentMoney limit
    if (parseInt(value * 12, 10) > saving) {
      setErrorMessage("You cannot exceed your current money limit.");
    } else {
      setErrorMessage("");
    }
  };

  // fetching current all expense data
  const intiateAllExpensesAndSummary = async () => {
    if (!userId) return;

    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/users/${userId}`
    );

    // Converting mothly summary to yearly summary and updating total expense
    let sm = 0;
    let tempSummary = data?.data?.user?.summary;

    if (tempSummary.length > 0) {
      Object.entries(tempSummary[0]).forEach(([category, value]) => {
        if (
          !(
            category === "user" ||
            category === "__v" ||
            category === "_id" ||
            category === "id"
          )
        ) {
          if (category !== "investment_outflows") sm += 12 * value;
          tempSummary[0][category] *= 12;
        }
      });
    }

    // updating investment contribution
    if (tempSummary.length) {
      setMySummary(data?.data?.user?.summary[0]);
    }
    // updating myAll expenses
    setMyAllExpenses(data?.data?.user?.expenses);
  };

  // to update savings
  useEffect(() => {
    // Calculate savings whenever salary or expense changes
    const calculateSavings = () => {
      const newSaving = salary - expense - investment;
      setSaving(newSaving);
    };

    calculateSavings();
  }, [salary, expense, investment]);

  // handle user logout
  const handleLogout = async () => {
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    toast.success("Logout successfully");
    navigate("/");
    window.location.reload();
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

  // to scroll to TOP
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    intiateAllExpensesAndSummary();
  }, [userId]);

  // // to get all options in add Expense form
  useEffect(() => {
    setCategoryTypes(categoryData);
    setExpenseTypes(expenseData);
  }, [userId]);

  return (
    <div className="container mx-auto min-h-screen bg-[#000] px-4 py-8 rounded-lg shadow-md">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-4 bg-[#4D3C77] bg-opacity-80 fixed top-0 left-0 right-0 z-10 px-4 py-2">
        <h1 className="text-2xl font-semibold text-white">Budget Planner</h1>
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
          {/* Expense category */}
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

          <select
            value={selectedExpense}
            onChange={(e) => setSelectedExpense(e.target.value)}
            className="mb-4 mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full"
          >
            <option value="">Expense</option>
            {Object.entries(expenseMapping)
              .filter(([key, value]) => value === selectedExpenseCategory)
              .map(([expense, typeOfExpense], index) => (
                <option key={index} value={expense}>
                  {expense}
                </option>
              ))}
          </select>

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
          <img src="/images/mainpage.png" alt="budget planner image" />
        </div>
      </div>

      {/* Summary */}
      <div className="pt-8 flex flex-col lg:flex-row items-center justify-center">
        <div className="md:w-full">
          <Summary mySummary={mySummary} salary={salary} />
        </div>
        <div className="md:w-full">
          <SummaryPieChart
            salary={salary}
            setSalary={setSalary}
            investment={investment}
            expense={expense}
          />
        </div>
      </div>

      {/* MY ALL EXPENSE COMPONENT */}
      {myAllExpenses && (
        <MyExpenses myAllExpenses={myAllExpenses} userSalary={salary} />
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
}

export default MainPage;
