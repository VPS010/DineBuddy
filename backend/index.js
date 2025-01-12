const express = require('express')
const dotenv = require('dotenv');
const app= express()
const mainRouter = require('./routes/index')
const connectDB = require('./config/dbconnection');



dotenv.config();
app.use(express.json());
app.use("/api/v1",mainRouter)

connectDB();

app.get("/",(req,res)=>{
    res.send("ya server is UP!")
})



app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});


app.listen(3000,()=>{
    console.log("server is running at Port 3000");
})