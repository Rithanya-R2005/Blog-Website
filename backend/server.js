const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const cookie=require('cookie-parser');
const user=require('./routes/userRoutes');
const blog=require('./routes/blogRoutes');
const app=express();
require("dotenv").config();
app.use(cors({
     origin: true,
    //origin:"http://localhost:3001",
    credentials:true
}));
app.use(express.json());
app.use(cookie());

mongoose
  .connect(process.env.DB_STRING)
  .then(()=>console.log("MongoDB conneted"))
  .catch((err)=>console.error(err));

const User=require('./models/UserSchema');
const Blog = require('./models/BlogSchema');
app.use('/api/users',user);
app.use('/api/blog',blog);

// app.listen(5001,()=>{
//     console.log("server running at 5001");
// })

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});
