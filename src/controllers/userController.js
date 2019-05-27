const express = require('express')
const authMiddleware = require("../middleware/auth")
const router = express.Router()
const User = require("../models/User")

router.use(authMiddleware)

router.get('/', async (req, res) => {
    
    const userTemp =  await User.find({_id:req.userId})
    const isAdmin =  userTemp[0].isAdmin

    console.log(isAdmin)
    if(!isAdmin){
        return res.status(401).send({error:"Not permission"})
    }
    
    res.send({users: await User.find()})
})
    
module.exports = app => app.use('/users',router)