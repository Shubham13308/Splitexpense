const mongoose= require('mongoose');

const groupnameSchema= new mongoose.Schema({
    group_name:{
        type:String,
        
    }
})
const Group=mongoose.model('Group',groupnameSchema)

module.exports= Group