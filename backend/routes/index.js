const express = require('express');
const router = express.Router();


const UserRouter= require('./user')
const AdminRouter= require('./admin')


router.use("/user",UserRouter);



router.use("/admin",AdminRouter);




module.exports=router