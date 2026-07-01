const jwt=require('jsonwebtoken');
const User=require('../models/User');
const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');

exports.protect=catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies && req.cookies.jwt){
        token = req.cookies.jwt;
    }
    if(!token){
        return next(new AppError("You are not logged in please login to get access.",401));

    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const currentUser=await  User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token no longer exists.',400));
    }
    req.user=currentUser;
    next();
});
exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.roles)){
            return next(
                new AppError('You do not have permission to perform this action',403)
            );
        }
        next();
    }
}