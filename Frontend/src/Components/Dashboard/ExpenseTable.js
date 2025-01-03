import React from "react";
import "../../Css/expensetable.css";

const ExpenseTable = ({ tabledata }) => {
  // console.log("Received tabledata:", tabledata);

  return (
    <div className="expense-table">
      <h4>Expense Table</h4>
      <div className="table-container">
        
        <table border="1" cellSpacing="0" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Expense</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tabledata).map(([date, records]) => {
              const recordsArray = Array.isArray(records) ? records : [];
              const totalSpent = recordsArray.reduce(
                (acc, record) => acc + Number(record.amount || 0),
                0
              );

              return (
                <React.Fragment key={date}>
                  <tr>
                    <td
                      colSpan="3"
                      className="date-header"
                      style={{
                        fontSize: "medium",
                        color: "coral",
                        fontWeight: "600",
                      }}
                    >
                      Expense Added : {date}
                    </td>
                  </tr>

                  {recordsArray.map((record, index) => (
                    <tr key={`${date}-${index}`}>
                      <td>{record.name}</td>
                      <td>{record.amount}</td>
                      <td>{record.expense}</td>
                    </tr>
                  ))}

                  <tr>
                    <td
                      colSpan="3"
                      style={{ textAlign: "right", fontWeight: "bold" }}
                    >
                      Total Spent: {totalSpent}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
