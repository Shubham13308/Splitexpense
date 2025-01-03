import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Css/Details.css";
import { useLocation } from "react-router-dom";
import Pay from "./Pay";
import AddExpenseModal from "../Modal/AddExpenseModal";
import AddMemberModal from "../Modal/AddMemberModal";
import ExpenseTable from "./ExpenseTable";
import { useNavigate } from "react-router-dom";

const Details = () => {
  const location = useLocation();
  const { membersData } = location.state || {};
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [groupname, setGroupName] = useState("");
  const [paydescription,setPayDescription]=useState([])
  // const [selectedMember, setSelectedMember] = useState(null);
  const [membername,setMemberName]=useState(null);
  const [formData, setFormData] = useState([]);
  const [payAmount, setPayAmount] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [isSplit, setIsSplit] = useState(false); // State to control visibility of Pay component
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4002/memberdetailroute/fetch-member",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Raw API Response:", response.data.data?.group_name || "");
      const members = response.data?.memberdetails;
      setFormData(Array.isArray(members) ? members : members ? [members] : []);
      setGroupName(response.data.data?.group_name || "");
    } catch (err) {
      console.error("Error fetching group details:", err);
    }
  };

  const fetchtableHandler = async (groupname) => {
    if (!groupname) {
      console.error("Group name is required for fetching table data.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4002/group/fetchtable",
        {
          groupname,
        }
      );
      if (response.status === 200) {
        setTableData(response.data?.data || []);
      }
    } catch (error) {
      console.error("Error during table fetch:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (groupname) {
      fetchtableHandler(groupname);
      fetchPayData()
    }
  }, [groupname]);

  const handleOpenExpenseModal = (name) => {
    setMemberName(name);
    setOpenAddExpenseModal(true);
  };
  

  const handleCloseExpenseModal = () => setOpenAddExpenseModal(false);
  

  const handleAddExpense = async (data) => {
    
    const currentDate = new Date();
    console.log(data)
    const payload = {
      ...data,
      groupName: groupname,
      date: currentDate,
    };
    

    try {
      // return false
      const response = await axios.post(
        "http://localhost:4002/group/add-expense",
        payload
        
      );

      if (response.status === 201) {
        console.log("Expense successfully added:", response.data);
        setFormData((prev) => [...prev, response.data]);
      } else {
        console.error("Failed to add expense:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding expense:", error.message);
    }
  };

  const handleCloseMemberModal = () => setOpenAddMemberModal(false);
  const handleMemberModal = () => setOpenAddMemberModal(true);

  const splitExpense = async (formData, selectedNumber) => {
    const totalAmount = formData.reduce(
      (acc, user) => acc + (parseFloat(user.amount) || 0),
      0
    );
    const perPersonShare = totalAmount / selectedNumber;

    const calculateBalances = (data, share) => {
      const lenders = data
        .filter((user) => parseFloat(user.amount) > share)
        .map((user) => ({
          ...user,
          deposit: parseFloat(user.amount) - share,
        }));

      const owers = data
        .filter((user) => parseFloat(user.amount) < share)
        .map((user) => ({
          ...user,
          balance: share - parseFloat(user.amount),
          hasToPay: [],
        }));

      return { lenders, owers };
    };

    const { owers, lenders } = calculateBalances(formData, perPersonShare);
    const balanceSheet = [];

    owers.forEach((ower) => {
      lenders.every((lender) => {
        if (lender.deposit > 0) {
          const amountToPay = Math.min(lender.deposit, ower.balance);
          if (amountToPay > 0) {
            ower.balance -= amountToPay;
            lender.deposit -= amountToPay;
            balanceSheet.push({
              username: ower.name,
              hasToPay: amountToPay,
              to: lender.name,
              perPersonShare: perPersonShare,
              groupname: groupname,
            });
          }
        }
        return ower.balance > 0;
      });
    });

    console.log("Final Balance Sheet:", balanceSheet);
    // return false;
    try {
      const response = await axios.post(
        "http://localhost:4002/memberdetailroute/member-average",
        {
          average: perPersonShare,
          groupname: groupname,
          balanceSheet:balanceSheet
        }
      );

      if (response.status === 200) {
        console.log("Request successful", response.data);
        setIsSplit(true);

        fetchData();
        fetchPayData();
      }
    } catch (error) {
      console.error("Error during settlement request:", error);
    }
  };
  const fetchPayData = async () => {
    try {
      const response = await axios.post("http://localhost:4002/memberdetailroute/pay-data", {
        groupName: groupname,
      });
  
      if (response.status === 200) {
        
        setPayDescription(response.data?.data)
      }
    } catch (err) {
      console.error("Error fetching pay data:", err);
    }
  };
  
  

  const settlementHandler = async (data) => {
    // console.log("data:", data);

    try {
      const response = await axios.post(
        "http://localhost:4002/group/settlements",
        {
          data,
        }
      );

      if (response.status === 200) {
        console.log("Request successful", response.data);
        fetchData();
        fetchPayData();
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
      } else if (error.request) {
        console.log("Error request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
    }
  };
 
  

  return (
    <>
      <AddExpenseModal
        isOpen={openAddExpenseModal}
        onClose={handleCloseExpenseModal}
        members={formData}
        onAddExpense={handleAddExpense}
        membername={membername}
      />
      <AddMemberModal
        isOpen={openAddMemberModal}
        onClose={handleCloseMemberModal}
        groupName={groupname}
      />

      <div className="details-container">
        <div className="member-box">
          <h3>Member Details</h3>
          <div className="member-grid">
          {Array.isArray(formData) && formData.length > 0 ? (
  formData.map((member, index) => (
    <div key={index} className="member-item">
      <p className="member-name">{member.name}</p>
      {member.amount === 0 ? (
        <button
          className="add-expense-btn"
          onClick={() => handleOpenExpenseModal(member.name)}
        >
          Add Expense
        </button>
      ) : (
        <p>{member.amount}</p>
      )}
    </div>
  ))
) : (
  <p>No members found. Please add members to the group.</p>
)}

            <button
              onClick={handleMemberModal}
              style={{ backgroundColor: "#49aa3f" }}>
              Add Members
            </button>
          </div>
        </div>

        <div className="split-box">
          <h3>Split Expense</h3>
          <button onClick={() => splitExpense(formData, formData.length)}>
            Split Equally
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            style={{ backgroundColor: "#9b5f00" }}
            onClick={handleOpenExpenseModal}>
            Add Expense
          </button>
          <div className="balance-sheet">
            <h4>Balance Sheet</h4>
            <Pay  paydescription={paydescription} settlementHandler={settlementHandler} />
          </div>
        </div>

        <div className="table-section">
          <ExpenseTable tabledata={tabledata} />
        </div>
      </div>
    </>
  );
};

export default Details;
