const mongoose = require('mongoose');
const complaintSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:[true,'Complaint title is required'],
            trim: true
        },
        description :{
            type:String,
            required:[true,'Complaint description is required']
        },
        category:{
            type:String,
            required:[true,'Category of the complaint is required'],
            enum:['Pothole','Garbage Overflow','Water Leakage','Broken street light'],
        },
        priority:{
            type:String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium',
        },
        status:{
            type:String,
            enum:['Pending','Assigned','In Progress','Resolved','Closed'],
            default:'Pending'
        },
        citizen:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:[true,'Complaint must belong to a citizen']
        },
        location:{
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address:String
        },
        images:{
            beforeUrl:String,
            beforePublicId:String,
            afterUrl:String,
            afterPublicId:String
        },
        workNotes:{
            type:String,
            trim:true
        },
        resolvedAt:Date,
        
        
    },
    {timestamps:true}
)
complaintSchema.index({ status: 1 });
complaintSchema.index({ citizen: 1 });
complaintSchema.index({ assignedWorker: 1 });
complaintSchema.index({ location: '2dsphere' });

module.exports=mongoose.model('Complaint',complaintSchema)