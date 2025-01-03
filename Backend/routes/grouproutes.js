const express= require('express')
const router= express.Router()
const validatememberLogin= require('../middleware/verifymembermiddleware')
const {
    groupnameHandler,
    addgroupmembersHandler,
    deleteGroupHandler,
    grouphistoryHandler,
    // fetchmemberHandler,
    
    settleamountHandler,
    fetchtableHandler,
    addMemberHandler,
    // fetchdashboardhandler,
    // memberaverageHandler
}= require('../controller/groupController')


router.post('/add-groupmember',addgroupmembersHandler);

router.get('/group-name',groupnameHandler);

router.delete('/delete-group/:groupName',deleteGroupHandler)

router.post('/add-expense',grouphistoryHandler);
// router.get('/members/:group_name', fetchmemberHandler); 



router.post('/settlements',settleamountHandler);

router.post('/fetchtable',fetchtableHandler);

router.post('/addnew-member',addMemberHandler);



// router.post('/member-average',memberaverageHandler)

module.exports=router