const mongoose = require('mongoose');

const membernameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    group_name: { type: String, required: true },
    expense_type:{type:String},
    amount: { type: Number,  min: 0, default: 0 },
    date: { type: Date, default: Date.now },
});

const MemberName = mongoose.model('MemberName', membernameSchema);

module.exports = MemberName;
