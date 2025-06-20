const mongoose = require("mongoose");
const { MONGO_URI } = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🟢 MongoDB connected");
  } catch (err) {
    console.error("🔴 MongoDB error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
