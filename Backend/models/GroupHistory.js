const mongoose= require('mongoose');

const grouphistorySchema= new mongoose.Schema({
    groupName:{type:String},
    name:{type:String},
    expense:{type:String},
    amount:{type:String},
    date:{type:String},

})
const Grouphistory= mongoose.model('Grouphistory',grouphistorySchema);

module.exports=Grouphistory;