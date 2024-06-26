const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// Define schema for the user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: { type: String, default: 'https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=626&ext=jpg&ga=GA1.1.914516780.1705759586&semt=ais' },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  bio: { type: String, default: 'Welcome to my profile!' }
});

userSchema.plugin(plm);

// Create mongoose model for the user schema
const User = mongoose.model('User', userSchema);

module.exports = User;
