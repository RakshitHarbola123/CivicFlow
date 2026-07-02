const express = require('express');
const complaintController=require('../controllers/complaintController');
const {protect,restrictTo}=require('../middleware/authMiddleware');
const {uploadImage}=require('../config/cloudinaryConfig');

const router=express.Router();
router.post(
    '/create',
    protect,
    restrictTo('citizen'),
    uploadImage.single('image'),
    complaintController.createComplaint
);
module.exports=router;