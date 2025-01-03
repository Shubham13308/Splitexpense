const jwt = require("jsonwebtoken")
const GroupName = require("../models/GroupName")
const MemberName = require("../models/MemberName");
const PayDetail = require("../models/PayDetail");
require("dotenv").config({});


const fetchmemberHandler= async (req,res) => {
    try
    {
        const {group_name}=req.params;
        if(!group_name){
            return res.status(400).json({message:"group name is required"})

        }
        const group=await GroupName.findOne({group_name:group_name})
        const token=jwt.sign({
            group_name:group_name
        },
    process.env.SECRET_KEY,
{expiresIn:"8h"}
)
res.status(200).json({
    message: `Details for group "${group_name}" fetched successfully.`,
    data:group_name,
    token:token
})

    }
    catch (err){
        console.log(err)
        

    }
    
}

const fetchdashboardhandler = async (req, res) => {
  try {
    const memberData = req.admin;
    // console.log("Received member data:", memberData.group_name);
    const memberdetails = await MemberName.find({ group_name: memberData.group_name });

    res.status(200).json({
      message: "Dashboard data processed successfully.",
      data: memberData,
      memberdetails: memberdetails,
    });
  } catch (err) {
    console.error("Error processing dashboard data:", err);
    res.status(500).json({
      message: "Error processing dashboard data.",
      error: err.message,
    });
  }
};

const memberaverageHandler = async (req, res) => {
  const { average, groupname,balanceSheet } = req.body;

  try {
    const totaluser = await MemberName.find({ group_name: groupname });
    for (let person of totaluser) {
      const updateAmount = Math.round(person.amount - average);
      console.log(updateAmount);
      
      await MemberName.updateOne(
        { _id: person._id, group_name: groupname },
        { $set: { amount: updateAmount } }
      );
    }
    
    const addPayData = balanceSheet.map((entry) => ({
      username: entry.username,
      amount: entry.hasToPay,
      to: entry.to,
      groupName: entry.groupname
    }));

    const addpay = await PayDetail.insertMany(addPayData);

    res.status(200).json({
      message: "Data received successfully",
      addedPayments: addpay
    });
  } catch (error) {
    console.error("Error settling amount:", error);

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const paydetailHandler = async (req, res) => {
  const { groupName } = req.body;
  console.log("Group Name:", groupName);

  try {
    
    const payDetails = await PayDetail.find({ groupName: groupName, status: "unsettle" });
    console.log("Fetched Pay Details:", payDetails);


    res.status(200).json({ success: true, data: payDetails });
  } catch (error) {
    console.error("Error fetching pay details:", error);

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




module.exports={fetchmemberHandler,fetchdashboardhandler,memberaverageHandler,paydetailHandler};  