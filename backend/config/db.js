const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://mongodb:27017/jobportal';
    console.log(`[Database] Connecting to MongoDB at: ${mongoURI.replace(/\/\/.*@/, '//<credentials>@')}`);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.log('[Database] Application will run with limited offline / mock capability if database is unavailable.');
  }
};

module.exports = connectDB;
