const mongoose =require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required :[true,'Please provide your name'],
            trim:true
        },
        email:{
            type:String,
            required:[true,'Please provide your email'],
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:[true, 'Please enter your password'],
            unique:true,
            minlength:8,
            select:false
        },
        phoneNumber:{
            type:String,
            trim:true
        },
        role:{
            type:String,
            enum:['citizen','worker','admin'],
            default:'citizen'
        },
        isActive:{
            type:Boolean,
            default:true,
            select:false
        }
    },
    {timestamps:true}
);
userSchema.pre('save',async function (next) {
    if(!this.isModified('password'))return next();
    this.password=await bcrypt.hash(this.password,12);
    next();
    
})
userSchema.methods.correctPassword=async function (candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};
module.exports=mongoose.model('User',userSchema);
