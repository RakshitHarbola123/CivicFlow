const Complaint = require('../models/Complaint');
const {uploadToCloudinary}=require('../config/cloudinaryConfig');
const {analyzeComplaintImage}=require('../utils/groqClient');
const {sendComplaintEmail}=require('../utils/email');
const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');

exports.createComplaint=catchAsync(async(req,res,next)=>{
    const {title,description,address,longitude,latitude}=req.body;
    if(!req.file){
        return next(new AppError('Please upload an image off the complaint issue.',400))
    }
    const cloudinaryResult=await uploadToCloudinary(req.file.buffer);
    const aiAnalysis=await analyzeComplaintImage(cloudinaryResult.url,description);
    const newComplaint = await Complaint.create({
        title,
        description:description || aiAnalysis.analysis,
        category:aiAnalysis.category,
        priority:aiAnalysis.priority,
        citizen:req.user._id,
        location:{
            type:'Point',
            coordinates:[longitude||0,latitude||0],
            address:address
        },
        images:{
            beforeUrl:cloudinaryResult.url,
            beforePublicId:cloudinaryResult.publicId
        },
        aiMetadata:{
            aiSuggestedCategory:aiAnalysis.category,
            aiSuggestedPriority:aiAnalysis.priority,
            analyzedAt:new Date()
        }
    })
    const emailHtmlContent = `
    <h3>New Civic Complaint Registered via CivicFlow AI</h3>
    <p><strong>Complaint ID:</strong> ${newComplaint._id}</p>
    <p><strong>Category:</strong> ${newComplaint.category} (${newComplaint.priority} Priority)</p>
    <p><strong>Location:</strong> ${address || 'Not specified'}</p>
    <hr />
    <p>${aiAnalysis.emailBody.replace(/\n/g, '<br>')}</p> 
    <hr />
    <p><strong>Evidence Image:</strong> <br><img src="${cloudinaryResult.url}" width="400" /></p>
  `;
    await sendComplaintEmail({
        email: process.env.DEMO_AUTHORITY_EMAIL, // .env se tumhari real personal email ID uthayega
        subject: `[${newComplaint.priority}] New ${newComplaint.category} Report #${newComplaint.title}`,
        html: emailHtmlContent
    });
    res.status(201).json({
        status: 'success',
        message: 'Complaint registered successfully and authority notified via AI mail.',
        data: {
            complaint: newComplaint
        }
    });
})

