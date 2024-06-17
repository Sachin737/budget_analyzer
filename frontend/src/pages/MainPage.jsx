import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useCallback, useId } from "react";
import axios from "axios";
import { AuthContext } from "../Context/auth";

import { MyExpenses } from "../components/MyExpenses";
import { Summary } from "../components/Summary";
import SummaryPieChart from "../components/SummaryPieChart";
import { jwtDecode } from "jwt-decode";
import { Spinner } from "../components/Spinner";

import SideNav from "../components/HamburgerMenu";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";

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

  // user  data
  const [userName, setUserName] = useState("");
  const [salary, setSalary] = useState(0);
  const [userId, setUserId] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [expense, setExpense] = useState(0);
  const [saving, setSaving] = useState(0);

  // all options
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);

  // list of all expenses (for user)
  const [myAllExpenses, setMyAllExpenses] = useState([]);
  const [mySummary, setMySummary] = useState([]);

  // selected options in form
  const [selectedExpense, setSelectedExpense] = useState("");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");
  const [selectedAmount, setSelectedAmount] = useState();

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
    // console.log("main:",data)

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

    // updating myAll expenses
    setMyAllExpenses(data?.data?.user?.expenses);

    // updating investment contribution
    if (tempSummary.length) {
      setMySummary(data?.data?.user?.summary[0]);
      setInvestment(data?.data?.user?.summary[0].investment_outflows);
    } else {
      setInvestment(0);
    }

    // updating expense
    setExpense(sm);

    // updating salary
    setSalary(data?.data?.user?.salaryAfterTax);
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
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`;

    setAuth({
      token: "",
    });

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
        salaryAfterTax: event.target.value || salary,
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
        // console.log(err);
      }
    };

    fetchUserbyId();
  });

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
    <div className="mx-auto min-h-screen px-8 py-4 rounded-lg">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-4 w-[100%] top-0 left-0 right-0 z-10 px-4 py-6">
        <SideNav />
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <img src="/images/mainIcon.png" width={32} alt="" />
            <h1 className="text-4xl font-semibold text-[#f9ae65] ml-4">
              Budget Planner
            </h1>
          </div>
          <div className="flex items-center ml-auto">
            <h3 className="text-lg font-semibold text-[#3c6d79] mr-2">
              Salary :
            </h3>
            <div className="relative rounded-lg">
              <input
                type="number"
                className="w-32 rounded-md px-2 py-2 focus:outline-none"
                value={salary}
                onChange={handleSalaryChange}
                readOnly={!isEditable}
              />
              <button
                className="absolute right-0 top-[-1px] bg-[#fff] text-white rounded-r-md h-full"
                onClick={() => {
                  setIsEditable(!isEditable);
                }}
              >
                {isEditable ? (
                  <img
                    src="/images/save.png"
                    alt="Save Button"
                    style={{ width: "42px", height: "42px" }}
                  />
                ) : (
                  <img
                    src="/images/edit.png"
                    alt="Edit Button"
                    style={{ width: "42px", height: "42px" }}
                  />
                )}
              </button>
            </div>

            <div className="relative rounded-lg mx-4 bg-white">
              <p className="w-28 ml-4 mr-4 py-2">{userName}</p>
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
      <div className="mainContent pt-16 flex flex-col md:flex-row gap-42 lg:gap-72 items-center justify-center lg:my-[20vh]">
        <div className="w-[32vw]">
          <img src="/images/mainpage.png" alt="budget planner image" />
        </div>

        <div className="expenseAdder bg-[#0F0F0F] rounded-lg p-8 shadow-md w-[36vw]">
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
            className="mt-4 px-4 py-2 bg-[#3c6d79] text-white rounded-md block w-full"
            disable={(
              selectedExpense == null ||
              selectedAmount == null ||
              errorMessage.length
            ).toString()}
          >
            Add
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col lg:flex-row items-center justify-around my-16">
        <div className="md:w-[40vw]">
          <Summary mySummary={mySummary} salary={salary} />
        </div>
        <div className="md:w-[40vw]">
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
{/* 
      <footer className="bg-[#f9ae65] text-dark py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Budget Planner. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
}

export default MainPage;
