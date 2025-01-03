import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; 
import { useNavigate } from 'react-router-dom'; 

import "../../Css/addmembermodal.css";

const AddMemberModal = ({ isOpen, onClose, groupName }) => {
  const [memberdata, setMemberData] = useState({
    name: "",
    expense_type: "",
    amount: "",
  });
  const navigate = useNavigate(); 

  if (!isOpen) return null;

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberdata, [name]: value });
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();

    
    if (isNaN(memberdata.amount) || Number(memberdata.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const currentDate = new Date();
    try {
      
      const response = await axios.post("http://localhost:4002/group/addnew-member", {
        name: memberdata.name,
        expense_type: memberdata.expense_type,
        amount: memberdata.amount,
        group_name: groupName, 
        date:currentDate
        
      });

      if (response.status === 200) {
        alert("Member added successfully!");
        setMemberData({ name: "", expense_type: "", amount: "" }); 
        

      } 
      // navigate('/group')
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error adding member. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h3>Add Member</h3>
        <form onSubmit={handleMemberSubmit}>
          <div className="form-group">
            <label htmlFor="groupName">
              Group Name: <span> {groupName}</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="memberName">Member Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={memberdata.name}
              onChange={handleMemberChange}
              placeholder="Enter member name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expenseType">Expense Type:</label>
            <input
              type="text"
              id="expense_type"
              name="expense_type"
              value={memberdata.expense_type}
              onChange={handleMemberChange}
              placeholder="Enter Expense Type"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={memberdata.amount}
              onChange={handleMemberChange}
              placeholder="Enter Amount"
              required
              min="1"
            />
          </div>
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

AddMemberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired, 
};

export default AddMemberModal;
