const express = require('express')

const User = require('../models/User.js')

const router = express.Router()

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')


function generateToken(params = {}){
    return jwt.sign(params,process.env.secret,
        {expiresIn:86400})
}

router.post('/register', async (req, res)=>{
    const { email, name } = req.body

    
    try{
        if(await User.findOne({email})){
            return res.status(400).send({error:"User already exists"})
        }    
        console.log(req.body)
        const user =  await User.create(req.body)
        user.password = undefined
        return res.status(200).send({user, token:generateToken({id:user._id})})
    }catch(err){
        return res.status(400).send({error:'Registration fail'})
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return res.status(400).send({erro:"User not found"})

    }
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error:"invalid password"})
    }
    user.password = undefined
 
    res.status(200).send({ user, token:generateToken({id:user._id}) })
})


module.exports = app => app.use('/auth',router)