const mongoose = require('mongoose');
const ROLES = require('../utils/roles');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: {type: String,enum: ["male", "female"], required: true,},
    address: {type: String,required: true,trim: true,},
    city: {type: String,required: true,trim: true,},
    birthday: {type: Date,required: true,},
    age: {type: Number},
    phone: {type: String,required: true,},
    password: { type: String, required: true }, 
    profileImage: { type: String, default: "https://res.cloudinary.com/dtnkj1dqe/image/upload/v1758109447/Facebook/users/profile/jibu3d0moicrpb3lusg2.jpg" },
    profileImage_public_id: { type: String ,default: "Facebook/users/profile/jibu3d0moicrpb3lusg2"} ,  
    backgroundImage: { type: String, default: "https://res.cloudinary.com/dtnkj1dqe/image/upload/v1758110469/Facebook/users/background/hyqdkbfl8dw49y9tz9rl.jpg" },
    backgroundImage_public_id: { type: String ,default: "Facebook/users/background/hyqdkbfl8dw49y9tz9rl"} ,
    bio: { type: String, default: "Hello World" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    role:{type:String ,  require:true , default:'user' ,  enum:[ROLES.USER , ROLES.ADMIN , ROLES.MANAGER]}, 
    logged:{type:Boolean , default:false} , 
    resetCode:{type:String},
    resetCodeExpire:{type:Date},
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
