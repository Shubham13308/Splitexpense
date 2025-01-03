const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());  
const cors = require("cors");
require("dotenv").config({});
const grouprouter = require('./routes/grouproutes');  
const memberrouter = require('./routes/memberdetailroutes')

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

app.use('/group', grouprouter);  
app.use('/memberdetailroute',memberrouter);


mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));


const PORT = process.env.PORT ;  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
