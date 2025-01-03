const jwt = require("jsonwebtoken");
const GroupName = require("../models/GroupName");

const Grouphistory = require("../models/GroupHistory");
const PayDetail = require("../models/PayDetail");
const MemberName= require('../models/MemberName')
require("dotenv").config({});

const addgroupmembersHandler = async (req, res) => {
  const { groupName, members } = req.body;

  
  if (!groupName) {
    return res.status(400).json({ message: "Group name is required" });
  }
  if (!Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ message: "Members array is required and should not be empty" });
  }

  try {
   
    const groupExists = await GroupName.findOne({ group_name: groupName });
    if (!groupExists) {
      const newGroup = new GroupName({ group_name: groupName });
      await newGroup.save();
    }

    
    const membersToInsert = members.map((member) => ({
      group_name: groupName,
      name: member.name,
      date: member.date || new Date(),
    }));
    const addedMembers = await MemberName.insertMany(membersToInsert);

    res.status(201).json({
      message: "Group and members added successfully!",
      group: groupName,
      members: addedMembers,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({
      message: "Error submitting form.",
      error: error.message,
    });
  }
};
const groupnameHandler = async (req, res) => {
  try {
    const groups = await MemberName.aggregate([
      {
        $group: {
          _id: "$group_name",
          membersCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          groupName: "$_id",
          membersCount: 1,
        },
      },
    ]);

    if (groups.length === 0) {
      return res.status(404).json({
        message: "No groups found",
      });
    }

    res.status(200).json({
      message: "Groups fetched successfully",
      groups,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching group data",
      error: err.message,
    });
  }
};
const deleteGroupHandler = async (req, res) => {
  try {
    const { groupName } = req.params;

    if (!groupName) {
      return res.status(400).json({ message: "Group name is required." });
    }
    console.log(groupName)
    const deleteResult = await GroupName.deleteMany({
      group_name: groupName,
    });

    const deleteMember = await MemberName.deleteMany({
      group_name: groupName,
    });
    const deletepaydetails= await PayDetail.deleteMany({
      groupName: groupName,
    })
    const deletegrouphistory= await Grouphistory.deleteMany({
      groupName: groupName,
    })

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        message: "Group not found or no members in the group.",
      });
    }

    await GroupName.deleteOne({ groupName });

    res.status(200).json({
      message: `Group "${groupName}" deleted successfully along with its members.`,
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({
      message: "Error deleting group.",
      error: error.message,
    });
  }
};
const grouphistoryHandler = async (req, res) => {
  const { amount, expense, name, groupName, date } = req.body;

  try {
    if (!amount || !expense || !name || !groupName || !date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newHistory = new Grouphistory({
      amount,
      expense,
      name,
      groupName,
      date,
    });
    const user = await MemberName.findOne({ name: name });
    user.amount += amount;
    console.log("amount",amount)
    console.log("user.amount",user.amount)
    await user.save();
    const savedHistory = await newHistory.save();

    return res.status(201).json({
      message: "Group history successfully recorded.",
      data: savedHistory,
    });
  } catch (error) {
    console.error("Error saving group history:", error);
    return res.status(500).json({
      error: "An error occurred while saving group history.",
      details: error.message,
    });
  }
};



const settleamountHandler = async (req, res) => {
  const { data } = req.body;

  try {
    
    const settleUser = await MemberName.findOne({
      group_name: data.groupName,
      name: data.username,
    });

    if (!settleUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    settleUser.amount = Math.max(0, settleUser.amount - data.amount);
    await settleUser.save();

    
    const settleTo = await MemberName.findOne({
      group_name: data.groupName,
      name: data.to,
    });

    if (!settleTo) {
      return res.status(404).json({ message: "Recipient not found" });
    }

   
    settleTo.amount = 0;
    await settleTo.save();

    
    const updatePayData = await PayDetail.updateOne(
      { 
        groupName: data.groupName,
        username: data.username,
        to: data.to
      },
      { 
        $set: { status: 'settled' } 
      }
    );

    if (updatePayData.modifiedCount === 0) {
      return res.status(404).json({ message: "No payment data found to update" });
    }

    res.status(200).json({
      message: "Amount settled successfully",
    });
  } catch (error) {
    console.error("Error settling amount:", error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const fetchtableHandler = async (req, res) => {
  try {
    const { groupname } = req.body;

    if (!groupname) {
      return res.status(400).json({
        message: "Group name is required.",
      });
    }

    const filteredData = await Grouphistory.find({ groupName: groupname });

    if (filteredData.length === 0) {
      return res.status(404).json({
        message: `No records found for group "${groupname}".`,
      });
    }

    const groupedData = filteredData.reduce((acc, record) => {
      const formattedDate = new Date(record.date).toISOString().slice(2, 10);

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }

      acc[formattedDate].push({
        name: record.name,
        amount: record.amount,
        expense: record.expense,
      });

      return acc;
    }, {});

    res.status(200).json({
      message: "Data fetched successfully.",
      data: groupedData,
    });
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(500).json({
      message: "An error occurred while fetching table data.",
      error: error.message,
    });
  }
};
const addMemberHandler = async (req, res) => {
  const { name, expense_type, amount, group_name, date } = req.body;

  try {
    const newMember = await MemberName.insertMany([
      {
        name,
        expense_type,
        amount,
        group_name,
        date: new Date(),
      },
    ]);
    const savedmemberhistory = await Grouphistory.insertMany([
      {
        name,
        expense: expense_type,
        amount,
        groupName: group_name,
        date: date,
      },
    ]);

    res.status(201).json({
      message: "Member added successfully",
      newMember,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error adding member",
      error: err.message,
    });
  }
};


module.exports = {
  groupnameHandler,
  addgroupmembersHandler,
  deleteGroupHandler,
  grouphistoryHandler,
  settleamountHandler,
  fetchtableHandler,
  addMemberHandler,
};
  // fetchmemberHandler,
  
  
  
  
  // fetchdashboardhandler,
  // memberaverageHandler,

