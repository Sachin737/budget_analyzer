import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import MyExpenses from "./components/MyExpenses";

function App() {
  // all options
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);

  // list of all expenses (for user)
  const [myAllExpenses, setMyAllExpenses] = useState([]);

  // selected options in form
  const [selectedExpense, setSelectedExpense] = useState("");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");
  const [selectedAmount, setSelectedAmount] = useState([]);

  // user data
  const [salary, setSalary] = useState(1200000);
  const [userId, setUserId] = useState("user123");

  const [expenseOptions, setExpenseOptions] = useState([]);

  // const handleAddExpenseOption = (expense) => {
  //   setExpenseOptions([...expenseOptions, expense]);
  // };

  // to Add new expense
  const handleAddExpense = async (name, amount) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API}/api/v1/expenses`,
      {
        typeOfExpense: selectedExpenseCategory,
        item: selectedExpense,
        monthly: selectedAmount,
        user: "66217b5dd1ae4f0693f1a500", // this user id will come from jwt user session!
      }
    );

    // updating all expense state element
    setMyAllExpenses([...myAllExpenses, data?.data]);

    // console.log(data?.data);
  };

  // to get all options in add Expense form
  const getAllInputOption = async () => {
    try {
      const { data } = await axios.get(
        // calling admin user [as we just need input options name]
        `${process.env.REACT_APP_API}/api/v1/users/66217b5dd1ae4f0693f1a503`
      );
      // console.log(data?.data?.user?.expenses);

      const temp = data?.data?.user?.expenses;
      const arr = temp.map((el) => el.item);
      const arr0 = [...new Set(temp.map((el) => el.typeOfExpense))];

      // console.log(arr);
      setCategoryTypes(arr0);
      setExpenseTypes(arr);
    } catch (err) {
      console.log(err);
    }
  };

  const totalMonthlyAmount = expenseOptions.reduce(
    (total, expense) => total + expense.monthlyAmount,
    0
  );
  const percentageOfSalary = (totalMonthlyAmount * 100) / salary;

  useEffect(() => {
    const intiateMyAllExpenses = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/users/66217b5dd1ae4f0693f1a500`
      );

      setMyAllExpenses(data?.data?.user?.expenses);
      console.log(data?.data?.user?.expenses);
    };

    intiateMyAllExpenses();
  }, []);

  useEffect(() => {
    getAllInputOption();
  }, []);

  return (
    <div className="container mx-auto min-h-screen bg-[#000] px-4 py-8 rounded-lg shadow-md">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-8 bg-[#EEEEEE] fixed top-0 left-0 right-0 z-10 px-4 py-2">
        <h1 className="text-2xl font-semibold text-black">Expense Tracker</h1>
        <div className="flex items-center">
          <p className="text-black mr-4">{userId}</p>
          <button className="px-4 py-2 bg-[#4D3C77] text-white rounded-md">
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="mainContent pt-16 flex flex-col md:flex-row items-center justify-center">
        <div className="expenseAdder bg-[#0F0F0F] rounded-lg p-4 shadow-md mb-4 w-full md:w-[40%] md:mr-8 md:mb-0 md:ml-8">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
            Add Expense
          </h2>
          {/* Expense category */}
          <select
            value={selectedExpenseCategory}
            onChange={(e) => setSelectedExpenseCategory(e.target.value)}
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

          {/* Expense name */}
          <select
            value={selectedExpense}
            onChange={(e) => setSelectedExpense(e.target.value)}
            className="mb-4 mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full"
          >
            <option value="">Expense</option>
            {expenseTypes &&
              expenseTypes.map((expense, index) => (
                <option key={index} value={expense}>
                  {expense}
                </option>
              ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            className="mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full"
            onChange={(e) => setSelectedAmount(e.target.value)}
          />
          <button
            onClick={() => handleAddExpense(selectedExpense, selectedAmount)} // Example values, replace with actual data input
            className="mt-4 px-4 py-2 bg-[#4D3C77] text-white rounded-md block w-full"
          >
            Add
          </button>
        </div>

        {/* Summary */}
        <div className="summary bg-[#0F0F0F] rounded-lg p-4 shadow-md flex-grow w-full md:w-[60%] md:ml-8 md:mr-8">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">Summary</h2>
          {/* {expenseOptions &&
            expenseOptions.map((expense, index) => (
              <div key={index} className="flex justify-between mb-2">
                <p className="text-sm font-medium text-[#EEEEEE] w-2/6">
                  {expense}
                </p>
                <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${expense.monthlyAmount.toLocaleString()}`}</p>
                <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${(
                  expense.monthlyAmount * 12
                ).toLocaleString()}`}</p>
                <p className="text-sm text-[#F2F7A1] w-1/6">{`${(
                  (expense.monthlyAmount * 100) /
                  salary
                ).toFixed(2)}%`}</p>
              </div>
            ))} */}
          {/* <div className="flex justify-between mt-4">
            <p className="text-sm font-medium text-[#EEEEEE] w-2/6">Total</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${totalMonthlyAmount.toLocaleString()}`}</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${(
              totalMonthlyAmount * 12
            ).toLocaleString()}`}</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`${percentageOfSalary.toFixed(
              2
            )}%`}</p>
          </div>
          <div className="flex justify-between mt-4">
            <p className="text-sm font-medium text-[#EEEEEE] w-2/6">Savings</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${(
              salary * 12 -
              totalMonthlyAmount
            ).toLocaleString()}`}</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${(
              (salary * 12 - totalMonthlyAmount) *
              12
            ).toLocaleString()}`}</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`${(
              100 - percentageOfSalary
            ).toFixed(2)}%`}</p>
          </div> */}
        </div>
      </div>

      {/* MY ALL EXPENSE COMPONENT */}
      <MyExpenses
        myAllExpenses={myAllExpenses}
        userSalary={salary}
      ></MyExpenses>
    </div>
  );
}

export default App;
