const redisClient = require("../config/redis");
const User =  require("../models/user")
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission = require("../models/submission")


const register = async (req,res)=>{
    
    try{
        // validate the data;

      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = 'user'
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:'user'},process.env.JWT_KEY,{expiresIn: '7d'});
     const reply = {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role:user.role,
    }
    
     res.cookie('token',token,{maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true});
     res.status(201).json({
        user:reply,
        token: token,
        message:"Loggin Successfully"
    })
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res)=>{

    try{
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});

        if(!user)
            throw new Error("Invalid Credentials");

        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: '7d'});
        res.cookie('token',token,{maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true});
        res.status(201).json({
            user:reply,
            token: token,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}


// logOut feature

const logout = async(req,res)=>{

    try{
        let token = req.cookies.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(400).send("No active session found");
        }
        const payload = jwt.decode(token);


        await redisClient.set(`token:${token}`,'Blocked');
        if (payload && payload.exp) {
            await redisClient.expireAt(`token:${token}`,payload.exp);
        }
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.clearCookie("token", {sameSite: 'none', secure: true});
    res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}


const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: '7d'});
     res.cookie('token',token,{maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}


const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.aggregate([
            {
                $project: {
                    name: { $concat: ["$firstName", " ", { $ifNull: ["$lastName", ""] }] },
                    totalQuestionsSolved: { $size: { $ifNull: ["$problemSolved", []] } }
                }
            },
            { $sort: { totalQuestionsSolved: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
}


module.exports = {register, login, logout, adminRegister, deleteProfile, getLeaderboard};