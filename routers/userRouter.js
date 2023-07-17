const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../Model/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleWare = async(req,resp,next)=>{
    try {
        const {email,password} = req.body;
        const userPresent = await User.findOne({email});
        if(userPresent) {
          const verify = await bcrypt.compare(password,userPresent.password)
          if(verify){
                const token = jwt.sign({_id:userPresent._id},process.env.SECRET_KEY)
                resp.status(200).send({token})
          }
          else next()
        }
        else resp.status(400).send({msg:"This email does not exist"})
    } catch (error) {
        resp.status(500).send({msg:"internal server error"})
    }
}

router.get("/",(req,resp)=>{
    resp.end("Hello world")
})


router.post("/register",async(req,resp)=>{
      try {
        const {email,password} = req.body;
        const userPresent = await User.findOne({email});
        if(userPresent) resp.status(400).send({msg:"email is already used register with different email"})
        else{
            const hassedPassword = await bcrypt.hash(password,10);
            const user = await User.create({...req.body,password:hassedPassword});
            resp.status(201).send(user)
        }
      } catch (error) {
            resp.status(500).send({msg:"internal server error"})
      }
})



router.post("/login",authMiddleWare,async(req,resp)=>{
    try {
        resp.status(400).send({msg:"Given email and password does not match"})
    } catch (error) {
          resp.status(500).send({msg:"internal server error"})
    }
})


module.exports = router;