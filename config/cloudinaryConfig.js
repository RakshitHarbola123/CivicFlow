const cloudinary = require('cloudinary').v2
const multer= require('multer');
const AppError=require('../utils/appError');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});
const storage=multer.memoryStorage();
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('/image')){
        cb(null,true);
    }
    else{
        cb(new AppError('Not an image, please upload images only.',400),false)
    }
}
exports.uploadImage=multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize:10*1024*1024}
})
exports.uploadToCloudinary=(fileBuffer)=>{
    return new Promise((resolve,reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream(
            {folder:'civicflow_complaints'},
            (error,result)=>{
                if(error)return reject(error);
                resolve({
                    url:result.secure_url,
                    publicId:result.public_id
                })
            }
        )
        uploadStream.end(fileBuffer);
    })
}