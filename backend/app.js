require('dotenv').config();
const express=require('express');const mongoose=require('mongoose');const cors=require('cors');const cookieParser=require('cookie-parser');const routes=require('./routes/api');
const app=express();app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173',credentials:true}));app.use(express.json());app.use(cookieParser());app.get('/health',(req,res)=>res.json({status:'ok'}));app.use('/api',routes);app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({error:err.message||'Server error'})});
const port=process.env.PORT||5000;mongoose.connect(process.env.MONGO_URI).then(()=>app.listen(port,()=>console.log(`API running on ${port}`))).catch(err=>{console.error('MongoDB connection failed',err);process.exit(1)});
