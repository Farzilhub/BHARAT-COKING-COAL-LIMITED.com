const mongoose = require("mongoose");
require("dotenv").config();

async function checkDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connection successful.");
    } catch (error) {
        console.error("MongoDB connection failed.");
        console.error(error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

checkDatabase();
