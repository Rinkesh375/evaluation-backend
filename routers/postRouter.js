const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Post = require("../Model/postModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findByIdAndDelete, findByIdAndUpdate } = require("../Model/userModel");
require("dotenv").config();

const verifyMiddleWare = (req, resp, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (token) {
            const user = jwt.verify(token, process.env.SECRET_KEY)
            if (user) {
                req._id = user._id;
                next()
            }
            else resp.status(400).send({ error: "Given token info is incorrect" })
        }
        else resp.status(400).send("token not provided")
    } catch (error) {
        resp.status(500).send({ msg: "internal server error" })
    }
}

router.get("/", verifyMiddleWare, async (req, resp) => {
    try {
        const query = req.query
        const post = await Post.find({ creator: req._id })
        resp.status(200).send(post)
    } catch (error) {
        resp.status(500).send({ msg: "internal server error" })
    }
})



router.post("/", verifyMiddleWare, async (req, resp) => {
    try {
        const post = await Post.create({ ...req.body, creator: req._id })
        resp.status(201).send(post)
    } catch (error) {
        resp.status(500).send({ msg: "internal server error" })
    }
})

router.delete("/delete/:id", verifyMiddleWare, async (req, resp) => {
    try {
        const { id } = req.params;
        let post = await Post.findById(id);
        if (post.creator.toString() === req._id) {
          
          post =  await Post.findByIdAndDelete(id);
       
            resp.status(200).send({})
        }
        else resp.status(400).send({ error: "A user can delete update only those post which have been created by him" })
    } catch (error) {
        resp.status(500).send({ msg: "internal server error" })
    }
})


router.patch("/update/:id", verifyMiddleWare, async (req, resp) => {
    try {
        const { id } = req.params;
        let post = await Post.findById(id);
        if (post.creator.toString() === req._id) {
            post = await Post.findByIdAndUpdate(id, req.body, { new: true });
            resp.status(200).send(post)
        }
        else resp.status(400).send({ error: "A user can delete update only those post which have been created by him" })
    } catch (error) {
        resp.status(500).send({ msg: "internal server error" })
    }
})


module.exports = router


