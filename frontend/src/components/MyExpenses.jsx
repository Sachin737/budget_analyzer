import React, { useState } from "react";

const MyExpenses = ({ myAllExpenses, userSalary }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0F0F0F] p-4 shadow-md mt-8 md:ml-8 md:mr-8 rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
        All Expenses
      </h2>

      {open == false ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-tl-lg">
                  Name
                </th>
                <th className="px-6 py-3 rounded-t-lg">Category</th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Monthly
                </th>
                <th className="px-6 py-3">Annually</th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  % of Salary
                </th>
              </tr>
            </thead>
            <tbody>
              {myAllExpenses.length &&
                myAllExpenses.map((ele, index) => (
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
                      {((12 * ele.monthly) / userSalary) * 100}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="relative">
            {/* Blurred background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#000000] opacity-50 blur-md"></div>

            {/* Container with blurred content */}
            <div className="relative z-10">
              {/* Table headline */}
              <div className="bg-white dark:bg-gray-800 py-2 px-4 rounded-lg shadow-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-tl-lg">
                        Name
                      </th>
                      <th className="px-6 py-3 rounded-t-lg">Category</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                        Monthly
                      </th>
                      <th className="px-6 py-3">Annually</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                        % of Salary
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Button container */}
              <div className="flex justify-center items-center mt-4">
                <button className="bg-white py-2 px-4 rounded-lg text-gray-800 font-semibold shadow-lg">
                  Show Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyExpenses;
