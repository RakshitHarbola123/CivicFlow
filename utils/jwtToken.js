const jwt=require('jsonwebtoken');

const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const sendTokenResponse=(user,statusCode,res)=>{
    const token=signToken(user._id);
    const cookieOptions={
        expires:new Date(
            Date.now()+process.env.JWT_EXPIRES_IN*24*60*60*1000
        ),
        httpOnly:true,
        secure:process.env.NODE_ENV==='production'
    }

user.password=undefined;
res.cookie('jwt',token,cookieOptions);
res.status(statusCode).json({
    status:'success',
    token,
    data:{user}
});
}
module.exports=sendTokenResponse;