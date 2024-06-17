import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import User from "../Models/userModel.js";
import generateToken from "../config/generateToken.js";
const registerUser = asyncHandler(async (req,res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }
    const userExists = await User.findOne({ email: email });
    if (userExists) { 
        res.status(400);
        throw new Error("User already exists");
    }
    const Hash_password = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name, email, password:Hash_password, pic });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(400);
                throw new Error("Failed to create user");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(req.body);
    if (user && (await bcrypt.compare(String(password), String(user.password)))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

const allUsers = asyncHandler(async (req, res) => { 
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}}).select("-password");
    res.send(users);

})

export { registerUser,authUser,allUsers };