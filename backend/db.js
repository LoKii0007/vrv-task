const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    const res = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${res.connection.host}`);
};

module.exports = connectDB;
