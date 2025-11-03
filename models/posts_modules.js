const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    images_public_id: [{ type: String }],
    visibility: { type: String, enum: ["public", "friends", "private"], default: "public" },
    likes: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["like", "love", "haha", "wow", "sad", "angry"], default: "like" } 
    }],
    comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
