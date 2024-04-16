import "./App.css";
import DropdownWithAdd from "./components/dropdown";
import { useState } from "react";

function App() {

  const [expenses, setExpenses] = useState([]);
  const [salary, setSalary] = useState(1200000);
  const [userId, setUserId] = useState("user123");

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const expenseTypes = [
    { name: "Household expenses", monthlyAmount: 360 },
    { name: "Other shoppings", monthlyAmount: 0 },
    { name: "Household help", monthlyAmount: 0 },
    { name: "Subscriptions", monthlyAmount: 0 },
    { name: "Pocket money (all members)", monthlyAmount: 0 },
    { name: "Expenses towards gifts", monthlyAmount: 0 },
    { name: "Medical expenses", monthlyAmount: 0 },
    { name: "Vacation expenses", monthlyAmount: 0 },
    { name: "Travel", monthlyAmount: 0 },
    { name: "Car & Petrol expenses", monthlyAmount: 0 },
    { name: "Lifestyle expenses", monthlyAmount: 0 },
    { name: "Donation/Charity", monthlyAmount: 0 },
    { name: "School & College Expenses", monthlyAmount: 0 },
    { name: "Miscellaneous expenses", monthlyAmount: 0 },
    { name: "Insurance payments", monthlyAmount: 1200 },
    { name: "Investments", monthlyAmount: 600 }
  ];

  const totalMonthlyAmount = expenses.reduce((total, expense) => total + expense.monthlyAmount, 0);
  const percentageOfSalary = (totalMonthlyAmount * 100) / salary;

  return (
    <div className="container mx-auto min-h-screen bg-[#000] px-4 py-8 rounded-lg shadow-md">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between mb-8 bg-[#EEEEEE] fixed top-0 left-0 right-0 z-10 px-4 py-2">
        <h1 className="text-2xl font-semibold text-black">Expense Tracker</h1>
        <div className="flex items-center">
          <p className="text-black mr-4">{userId}</p>
          <button className="px-4 py-2 bg-[#4D3C77] text-white rounded-md">Logout</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="mainContent pt-16 flex flex-col md:flex-row items-center justify-center">
        <div className="expenseAdder bg-[#0F0F0F] rounded-lg p-4 shadow-md mr-0 md:mr-8 mb-4 md:mb-0 w-full md:w-[40%]">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">Add Expense</h2>
          <DropdownWithAdd onAddExpense={handleAddExpense} />
          <input type="number" placeholder="Amount" className="mt-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 block w-full" />
          <button className="mt-4 px-4 py-2 bg-[#4D3C77] text-white rounded-md block w-full">Add</button>
        </div>
        <div className="summary bg-[#0F0F0F] rounded-lg p-4 shadow-md mt-4 md:mt-0 flex-grow w-full md:w-[60%]">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">Summary</h2>
          {expenseTypes.map((expense, index) => (
            <div key={index} className="flex justify-between mb-2">
              <p className="text-sm font-medium text-[#EEEEEE] w-2/6">{expense.name}</p>
              <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${expense.monthlyAmount.toLocaleString()}`}</p>
              <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${(expense.monthlyAmount * 12).toLocaleString()}`}</p>
              <p className="text-sm text-[#F2F7A1] w-1/6">{`${((expense.monthlyAmount * 100) / salary).toFixed(2)}%`}</p>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <p className="text-sm font-medium text-[#EEEEEE] w-2/6">Total</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${totalMonthlyAmount.toLocaleString()}`}</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${(totalMonthlyAmount * 12).toLocaleString()}`}</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`${percentageOfSalary.toFixed(2)}%`}</p>
          </div>
          <div className="flex justify-between mt-4">
            <p className="text-sm font-medium text-[#EEEEEE] w-2/6">Savings</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${(salary * 12 - totalMonthlyAmount).toLocaleString()}`}</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`₹${((salary * 12 - totalMonthlyAmount) * 12).toLocaleString()}`}</p>
            <p className="text-sm text-[#F2F7A1] w-1/6">{`${(100 - percentageOfSalary).toFixed(2)}%`}</p>
          </div>
        </div>
      </div>
      <div className="AllExpenses bg-[#0F0F0F] p-4 shadow-md mt-8">
        <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">All Expenses</h2>
        {/* Add components for displaying all expenses */}
      </div>
    </div>
  );
}

export default App;
