const mongoose = require('mongoose');

// Define schema for the post
const postSchema = new mongoose.Schema({
    postText: { type: String, required: true },
    image : { type: String, required: true } , 
    user: { type: mongoose.Schema.Types.ObjectId, ref : 'User'},
    createdAt: { type: Date, default: Date.now },
    likes: { type: Array, default: [] }
});

// Create mongoose model for the post schema
module.exports = mongoose.model('Post', postSchema);
