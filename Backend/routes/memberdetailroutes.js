const express= require('express')
const router = express.Router();
const validatememberLogin= require('../middleware/verifymembermiddleware')
const {fetchmemberHandler,fetchdashboardhandler,memberaverageHandler,paydetailHandler}=require('../controller/memberController')

router.get('/members/:group_name', fetchmemberHandler); 

router.get('/fetch-member',validatememberLogin,fetchdashboardhandler)

router.post('/member-average',memberaverageHandler)

router.post('/pay-data',paydetailHandler)


module.exports=router