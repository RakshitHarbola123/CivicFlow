const nodemailer=require('nodemailer');
exports.sendComplaintEmail=async(options)=>{
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST || 'smtp.gmail.com',
        port:process.env.EMAIL_PORT || 5587,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    });
    const mailOptions ={
        from:`"CivicFlow AI System" <${process.env.EMAIL_USER}>`,
        to:"harbolarakshit@gmail.com",
        subject: options.subject,
        html : options.html
    }
    await transporter.sendMail(mailOptions);
}