const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
require("dotenv").config();
app.use(express.json())


const connection = async()=>{
        try {
           await mongoose.connect(process.env.MONGO_URL) 
        } catch (error) {
            console.log(error)
        }
}

app.use("/users",userRouter)
app.use("/posts",postRouter)

app.listen(7000,()=>{
    connection()
})