const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["like", "love", "haha", "wow", "sad", "angry"],
        required: true,
    },
}, { timestamps: true });

reactionSchema.index({ postId: 1, userId: 1 }, { unique: true }); // user reacts once per post

module.exports = mongoose.model("Reaction", reactionSchema);

