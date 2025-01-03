const mongoose = require('mongoose');

const payDetailsSchema = new mongoose.Schema({
    groupName: { type: String },
    username: { type: String },
    amount: { type: String },
    to: { type: String },
    date:{type:String,default: () => new Date().toISOString() },
    status: { type: String, default: 'unsettle' } 
});

module.exports = mongoose.model('PayDetails', payDetailsSchema);
