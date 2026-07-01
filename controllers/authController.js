const User=require('../models/User');
const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');
const sendTokenResponse=require('../utils/jwtToken');

exports.signup=catchAsync(async(req,res,next)=>{
    const {name,email,password,phoneNumber,role}=req.body;

    const existingUser=await User.findOne({email});
    if(existingUser){
        return next(new AppError("Email already registered. Please login",400));
    }
    const newUser=await User.create({
        name,
        email,
        password,
        phoneNumber,
        role
    })
    sendTokenResponse(newUser, 201, res);
});
exports.login=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return next(AppError('Please provide email and password',400));
    }
    const user=await User.findOne({email}).select('+password');
    if(!user||!(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401));
    }
    sendTokenResponse(user,200,res);
});
exports.logout=catchAsync(async(req,res,next)=>{
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true,
    });
    res.status(200).json({
        status:'success',
        message:'Logged out successfully'
    });
})
