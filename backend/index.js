const express = require('express')
const dotenv = require('dotenv');
const app = express()
const mainRouter = require('./routes/index')
const connectDB = require('./config/dbconnection');
const cors = require('cors');



app.use(
    cors({
        // origin: "http://localhost:5173", // Replace with your frontend origin
        // methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        // credentials: true, // If you're using cookies or credentials
    })
);


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));



dotenv.config();
app.use(express.json());
app.use("/api/v1", mainRouter)



connectDB();

app.get("/", (req, res) => {
    res.send("ya server is UP!")
})



app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});


app.listen(3000, () => {
    console.log("server is running at Port 3000");
})