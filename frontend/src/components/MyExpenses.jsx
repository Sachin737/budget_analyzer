import React, { useEffect, useState } from "react";
import { categoryData } from "../defaultData/inputFieldData";

const MyExpenses = ({ myAllExpenses, userSalary }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState(myAllExpenses);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    // console.log(category);
    if (category === "") {
      setFilteredExpenses(myAllExpenses);
    } else {
      // console.log(myAllExpenses);
      const filtered = myAllExpenses?.filter(
        (el) => el.typeOfExpense === category
      );
      setFilteredExpenses(filtered);
      // console.log(filtered);
    }
  };

  useEffect(() => {
    // console.log(myAllExpenses)
    setFilteredExpenses(myAllExpenses);
  },[myAllExpenses]);

  return (
    <div className="bg-[#0F0F0F] p-4 shadow-md mt-8 md:ml-8 md:mr-8 rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#EEEEEE] mb-2 md:mb-0">
          All Expenses
        </h2>
        <div className="mb-2 md:mb-0">
          <label htmlFor="category" className="text-[#EEEEEE] mr-2">
            Filter :
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 bg-white rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Categories</option>
            {categoryData.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-tl-lg">
                Name
              </th>
              <th className="px-6 py-3 rounded-t-lg">Category</th>
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Monthly</th>
              <th className="px-6 py-3">Annually</th>
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                % of Salary
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredExpenses) &&
              filteredExpenses.map((ele, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                    {ele.item}
                  </td>
                  <td className="px-6 py-4">{ele.typeOfExpense}</td>
                  <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    {ele.monthly}
                  </td>
                  <td className="px-6 py-4">{12 * ele.monthly}</td>
                  <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                    {(((12 * ele.monthly) / userSalary) * 100).toPrecision(3)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyExpenses;
