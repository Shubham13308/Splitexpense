import React, { useState } from "react";
import "../../Css/addexpensemodal.css";

const AddExpenseModal = ({
  isOpen,
  onClose,
  members,
  onAddExpense,
  membername,
}) => {
  const [selectedMember, setSelectedMember] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleAddExpense = () => {
    const validMemberName =
      typeof membername === "string" ? membername : selectedMember;

    if (!validMemberName) {
      setError("Please select or enter a valid member name.");
      return;
    }

    const expenseData = {
      name: validMemberName,
      expense: expenseType.trim(),
      amount: parseFloat(amount),
    };

    if (!expenseType.trim() || !amount || isNaN(expenseData.amount) || expenseData.amount <= 0) {
      setError("Please provide valid expense details.");
      return;
    }

  
    setError("");

    onAddExpense(expenseData);
    setSelectedMember("");
    setExpenseType("");
    setAmount("");
    onClose();
    window.location.reload();
  };

  const handleClose = () => {
    onClose();
    setSelectedMember("");
    setError(""); // Clear any error when closing modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Expense</h3>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>

        <div className="form-group">
          <label htmlFor="member">Member:</label>
          {membername && typeof membername === "string" ? (
            <div className="selected-member">
              <p>{membername}</p>
            </div>
          ) : (
            <select
              id="member"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Select a member</option>
              {members.map((member, index) => (
                <option key={index} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="expenseType">Expense Type:</label>
          <input
            type="text"
            id="expenseType"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            placeholder="e.g., Groceries"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 100"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button className="add-button" onClick={handleAddExpense}>
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseModal;
