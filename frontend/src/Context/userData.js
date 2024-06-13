import { useState, useEffect, createContext } from "react";
import axios from "axios";

const UserDataContext = createContext();

const UserDataProvider = (props) => {
  const [userName, setUserName] = useState("pagal");
  const [salary, setSalary] = useState(0);
  const [userId, setUserId] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [expense, setExpense] = useState(0);
  const [saving, setSaving] = useState(0);

  const contextValue = {
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
      setInvestment(data?.data?.user?.summary[0].investment_outflows);
    } else {
      setInvestment(0);
    }

    // updating expense
    setExpense(sm);

    // updating salary
    setSalary(data?.data?.user?.salaryAfterTax);

    console.log("context:",data?.data?.user?.salaryAfterTax, sm, data?.data?.user?.summary[0].investment_outflows)
  };



  useEffect(() => {
    intiateAllExpensesAndSummary();
  },[userId]);

  // to update savings
  useEffect(() => {
    // Calculate savings whenever salary or expense changes
    const calculateSavings = () => {
      const newSaving = salary - expense - investment;
      setSaving(newSaving);
    };

    calculateSavings();
  },[expense, salary, investment]);

  return (
    <UserDataContext.Provider value={contextValue}>
      {props.children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataProvider };
