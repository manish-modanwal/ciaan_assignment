const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User'); 

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    console.log('All users have been deleted from the database.');
    mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
    mongoose.connection.close();
  }
};

clearDatabase();