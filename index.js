const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const cors = require("cors")
require("dotenv").config();
app.use(express.json())
app.use(cors())


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