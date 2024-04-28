import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import MyExpenses from "./components/MyExpenses";
import Summary from "./components/Summary";
import SummaryPieChart from "./components/SummaryPieChart"

import { categoryData, expenseData, expenseMapping } from "./defaultData/inputFieldData";

function App() {
  // all options
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);

  // list of all expenses (for user)
  const [myAllExpenses, setMyAllExpenses] = useState([]);
  const [mySummary, setMySummary] = useState([]);

  // selected options in form
  const [selectedExpense, setSelectedExpense] = useState("");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");
  const [selectedAmount, setSelectedAmount] = useState([]);

  // user data
  const [salary, setSalary] = useState(1200000);
  const [userId, setUserId] = useState("user123");
  const [investment, setInvestment] = useState(0);
  const [expense, setExpense] = useState(0);

  // to Add new expense
  const handleAddExpense = async (name, amount) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API}/api/v1/expenses`,
      {
        typeOfExpense: selectedExpenseCategory,
        item: selectedExpense,
        monthly: selectedAmount,
        user: "662a02d135e74805d6f7b113", // this user id will come from jwt user session!
      }
    );


    {// get updated summary
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/users/662a02d135e74805d6f7b113`
      );
      setMySummary(data?.data?.user?.summary[0]);

      // updating investment contribution
      setInvestment(data?.data?.user?.summary[0].investment_outflows);

      // updating total expense
      let sm = 0;
      Object.entries(data?.data?.user?.summary[0]).forEach(([category, value]) => {
        if (!(category === 'user' || category === '__v' || category === '_id' || category === 'id')) {
          sm += value;
        }
      });
      setExpense(sm);

      // updating myAll expenses
      setMyAllExpenses(data?.data?.user?.expenses);
      // console.log(data?.data?.user?.expenses);
    }

  };


  useEffect(() => {
    // fetching current all expense data
    const intiateAllExpensesAndSummary = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/users/662a02d135e74805d6f7b113`
      );

      setMyAllExpenses(data?.data?.user?.expenses);
      setMySummary(data?.data?.user?.summary[0]);

      // updating investment contribution
      setInvestment(data?.data?.user?.summary[0].investment_outflows);

      // updating total expense
      let sm = 0;
      Object.entries(data?.data?.user?.summary[0]).forEach(([category, value]) => {
        if (!(category === 'user' || category === '__v' || category === '_id' || category === 'id')) {
          sm += value;
        }
      });
      setExpense(sm);
    };

    intiateAllExpensesAndSummary();
  }, []);


  // to get all options in add Expense form
  useEffect(() => {
    setCategoryTypes(categoryData);
    setExpenseTypes(expenseData);
  }, []);

  return (
    <div className="container mx-auto min-h-screen bg-[#000] px-4 py-8 rounded-lg shadow-md">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-8 bg-[#EEEEEE] fixed top-0 left-0 right-0 z-10 px-4 py-2">
        <h1 className="text-2xl font-semibold text-black">Budget Analyser</h1>
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
            onChange={(e) => {
              setSelectedExpenseCategory(e.target.value);
              // Reset selectedExpense when the category changes
              setSelectedExpense('');
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
            onChange={(e) => setSelectedAmount(e.target.value)}
          />
          <button
            onClick={() => handleAddExpense(selectedExpense, selectedAmount)} // Example values, replace with actual data input
            className="mt-4 px-4 py-2 bg-[#4D3C77] text-white rounded-md block w-full"
          >
            Add
          </button>
        </div>


      </div>
      {/* Summary */}
      <div className="pt-8 flex flex-col lg:flex-row items-center justify-center">
        <div className="md:w-full">
          <Summary mySummary={mySummary} salary={salary} />
        </div>
        <div className="md:w-full">
          <SummaryPieChart salary={salary} investment={investment} expense={expense} />
        </div>
      </div>


      {/* MY ALL EXPENSE COMPONENT */}
      {myAllExpenses && <MyExpenses
        myAllExpenses={myAllExpenses}
        userSalary={salary}
      />}
    </div >
  );
}

export default App;
