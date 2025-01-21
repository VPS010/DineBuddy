const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Connect to the MongoDB database
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000,         // 45 seconds
        });

        // Event listeners for monitoring connection state
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.error(`Error connecting to MongoDB: ${err.message}`);
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log the error and exit the process if the connection fails
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;
