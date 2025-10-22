const mongoose = require('mongoose');
const connectDB = require('../config/db'); 
const User = require('../models/User');     

const deleteUsers = async () => {
  await connectDB();

  try {
    const result = await User.deleteMany({ publisherName: "Leads Expert" });
    console.log(`Deleted ${result.deletedCount} user(s) with publisherName "Leads Expert".`);
  } catch (error) {
    console.error("Error deleting users:", error);
  } finally {
    mongoose.connection.close();
  }
};

deleteUsers();
