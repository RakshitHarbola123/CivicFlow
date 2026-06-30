const express = require('express');
const dotenv=require('dotenv');
const connectDB=require('./config/db.js');
const AppError=require('./utils/appError.js');
const globalErrorHandler=require('./middleware/errorMiddleware.js');
dotenv.config({path:'./.env'});
connectDB();
const app=express();

app.use(express.json({limit:'10kb'}));
app.get('/api/v1/health',(req,res)=>{
    res.status(200).json({status:'Success',message:'CivicFlow API operational'});
});
app.all('*',(req,res,next)=>{
    next(new AppError(`Cant find ${req.originalUrl} on this server`,404));
});
app.use(globalErrorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Application running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});