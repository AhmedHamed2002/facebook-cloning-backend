const User = require('../models/user_modules');
const Post = require('../models/posts_modules');
const  httpsStatusText  =  require('../utils/httpStatusText') ; 
const { validationResult , matchedData} =  require('express-validator') ; 
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const Roles = require('../utils/roles'); 
const transporter = require("../utils/email");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

const getAllUsers = async (req, res) => {
    try {
        const visitor = await User.findById(req.user.id).select("friends friendRequests");
        const excludeIds = [req.user.id, ...visitor.friends];
        const users = await User.find(
            { _id: { $nin: excludeIds } }
        ).select("name role profileImage bio logged friendRequests");

        const view = users.map(user => {
            let relation = "none";

            if (visitor.friendRequests.includes(user._id)) {
                relation = "confirm"; 
            } else if (user.friendRequests.includes(visitor._id)) {
                relation = "pending"; 
            }

            return {
                id: user._id,
                name: user.name,
                role: user.role,
                image: user.profileImage,
                bio: user.bio,
                logged: user.logged,
                relation
            };
        });

        res.json({ status: httpsStatusText.SUCCESS, data: view });
    }
    catch (err) {
        res.status(500).json({ status: httpsStatusText.ERROR, message: err.message });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }, { password: 0, __v: 0 });
        if (!user) return res.status(404).json({status:httpsStatusText.FAIL , data:"user not found"}) ;
        if(req.user.id === req.params.id) return res.status(200).json({status:httpsStatusText.SUCCESS , data:"this is your profile"}); 
        
        const visitor = await User.findById(req.user.id);
        // default
        let isFriend = false;
        // check if already friends
        if (visitor.friends.includes(req.params.id)) isFriend = true;
        // check if the user has sent a request
        else if (visitor.friendRequests.includes(req.params.id)) isFriend = "confirm";
        // check if the user has received a request
        else if (user.friendRequests.includes(req.user.id)) isFriend = "pending";
        

        const view = {
            id: user._id ,
            name: user.name , 
            role: user.role , 
            profileImage: user.profileImage ,
            backgroundImage: user.backgroundImage ,
            age: user.age ,
            gender: user.gender ,
            address: user.address ,
            city: user.city ,
            birthday: user.birthday , 
            bio: user.bio , 
            logged: user.logged ,
            isFriend: isFriend
        }
        if(req.user.role == Roles.ADMIN){
            view.email = user.email ; 
            view.phone = user.phone ;
        }
        res.status(200).json({status:httpsStatusText.SUCCESS , data:view}) ;
    }
    catch (err) {
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const imageUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("friendRequests", "name profileImage");
        
        if (!user) return res.status(404).json({ status: httpsStatusText.FAIL, message: "User not found" });
        const view = {
            profileImage: user.profileImage,
            name: user.name,
            friendRequests: user.friendRequests
        };

        if (user.profileImage_public_id) return res.status(200).json({ status: httpsStatusText.SUCCESS, data: view });
    } 
    catch (err) {
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ;
    }
};

const search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) return res.status(400).json({ status: httpsStatusText.FAIL, message: "Query is required" });

        let searchCriteria = [
            { name: { $regex: query, $options: "i" } },
            { address: { $regex: query, $options: "i" } },
            { city: { $regex: query, $options: "i" } },
        ];
        
        const results = await User.find({ $or: searchCriteria }, { __v: 0 });

        if (results.length === 0) return res.status(404).json({ status: httpsStatusText.FAIL, message: "No results found" });

        const view = results.map(user => ({
            id: user._id,
            name: user.name,
            role: user.role,
            image: user.profileImage,
            logged: user.logged,
            city: user.city,
            address: user.address,
            status: user.isloggin
        }));
        
        res.status(200).json({status: httpsStatusText.SUCCESS, data: view});
    } catch (err) {
        res.status(500).json({ status: httpsStatusText.ERROR, message: "server error" });
    }
};

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            if (req.files["profileImage"] && req.files["profileImage"][0].path && req.files["profileImage"][0].filename !== "Facebook/users/profile/jibu3d0moicrpb3lusg2.jpg") {
                await cloudinary.uploader.destroy(req.files["profileImage"][0].filename);  
            }
            return res.status(400).json({status: httpsStatusText.FAIL,data: errors.array()});
        }
        
        const data = matchedData(req);

        const oldUser = await User.findOne({ email: data.email });
        if (oldUser){
            if (req.files["profileImage"] && req.files["profileImage"][0].path && req.files["profileImage"][0].filename !== "Facebook/users/profile/jibu3d0moicrpb3lusg2.jpg") {
                await cloudinary.uploader.destroy(req.files["profileImage"][0].filename);  
            }
            return res.status(400).json({status: httpsStatusText.FAIL,data: "user already exist"});
        } 

        // hash password
        const myPlaintextPassword = data.password;
        data.password = await bcrypt.hash(myPlaintextPassword, 10);

        let userData = { ...data };

        if (req.files && req.files["profileImage"] && req.files["profileImage"][0]) {
            userData.profileImage = req.files["profileImage"][0].path;       
            userData.profileImage_public_id = req.files["profileImage"][0].filename;
        }

        if (req.files && req.files["backgroundImage"] && req.files["backgroundImage"][0]) {
            userData.backgroundImage = req.files["backgroundImage"][0].path;       
            userData.backgroundImage_public_id = req.files["backgroundImage"][0].filename;
        }

        const today = new Date();
        userData.age = today.getFullYear() - data.birthday.getFullYear(); 

        const user = new User(userData); 
        await user.save() ; 

        return res.status(201).json({status: httpsStatusText.SUCCESS,data: "user created successfully",});
    } catch (err) {
        if (req.files["profileImage"] && req.files["profileImage"][0].path && req.files["profileImage"][0].filename !== "Facebook/users/profile/jibu3d0moicrpb3lusg2.jpg") {
            await cloudinary.uploader.destroy(req.files["profileImage"][0].filename);  
        }
        return res.status(500).json({status: httpsStatusText.ERROR,message: err.message,});
    }
};

const login =  async(req , res) =>{
    try{
        const errors = validationResult(req) ;
        if(!errors.isEmpty()) return res.status(400).json({status:httpsStatusText.FAIL , data:errors.array()})
        
        const data = matchedData(req) ; 
        const user = await User.findOne({email:data.email}) ; 
        if(user) {
            const match = await bcrypt.compare(data.password , user.password) ; 
            if(match){
                //gen token
                const dataInToken = {
                    name : user.name , 
                    email : user.email , 
                    role : user.role , 
                    id : user._id
                }
                let token = jwt.sign(dataInToken, process.env.JWT_SECRET_KEY , {expiresIn:'24 h'});
                user.logged  =  true ; 
                await user.save() ; 
                return res.status(200).json({status:httpsStatusText.SUCCESS , data:"login successfully" , token}) ; 
            }
        } 
        return res.status(400).json({status:httpsStatusText.FAIL , data:"email or password is incorrect"})
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const logout =  async(req , res) =>{
    try{
        const user = await User.findOne({email:req.user.email}) ;
        user.logged  =  false ; 
        await user.save() ; 
        return res.status(200).json({status:httpsStatusText.SUCCESS , data:"logout successfully"}) ;
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
    
}

const check  =  async(req , res) =>{
    try{
        const user = await User.findOne({email:req.user.email}) ;
        if(user.logged === true) 
            return res.status(200).json({status:httpsStatusText.SUCCESS , data:"user is logged in"}) ;
        else 
            return res.status(401).json({status:httpsStatusText.FAIL , data:"user is not logged in"}) ;
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const  profile  =  async(req , res) =>{
    try{
        const myProfile = await User.findOne(
            { _id: req.user.id },
            {
                password: 0,
                __v: 0,
                backgroundImage_public_id: 0,
                profileImage_public_id: 0,
            }
        )
        .populate("friendRequests", "name profileImage")
        .populate("friends", "name profileImage bio address city")
        .exec();

        const posts = await Post.find({ authorId: req.user.id }).sort({ createdAt: -1 })
            .populate({
                path: "likes.userId",
                select: "name profileImage"
            })
            .populate({
                path: "comments.userId",
                select: "name profileImage" 
            });
            
        return res.status(200).json({status:httpsStatusText.SUCCESS , data:{myProfile,posts}}) ;
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const updateProfile = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            if (
                req.files["profileImage"] &&
                req.files["profileImage"][0].path &&
                req.files["profileImage"][0].filename !==
                "facebook/users/profile/jibu3d0moicrpb3lusg2"
            ) {
                await cloudinary.uploader.destroy(
                req.files["profileImage"][0].filename
                );
            }
            if (
                req.files["backgroundImage"] &&
                req.files["backgroundImage"][0].path &&
                req.files["backgroundImage"][0].filename !==
                "Facebook/users/background/hyqdkbfl8dw49y9tz9rl"
            ) {
                await cloudinary.uploader.destroy(
                req.files["backgroundImage"][0].filename
                );
            }   

            return res
                .status(400)
                .json({ status: httpsStatusText.ERROR, message: error.array() });
        }

        const data = matchedData(req);
        

        // check email duplication
        if (data.email) {
        let isFind = await User.findOne({ email: data.email });
            if (isFind && isFind._id.toString() !== req.user.id.toString()) {
                // clean uploaded images
                if (
                req.files["profileImage"] &&
                req.files["profileImage"][0].path &&
                req.files["profileImage"][0].filename !==
                    "facebook/users/profile/jibu3d0moicrpb3lusg2"
                ) {
                await cloudinary.uploader.destroy(
                    req.files["profileImage"][0].filename
                );
                }
                if (
                req.files["backgroundImage"] &&
                req.files["backgroundImage"][0].path &&
                req.files["backgroundImage"][0].filename !==
                    "Facebook/users/background/hyqdkbfl8dw49y9tz9rl"
                ) {
                await cloudinary.uploader.destroy(
                    req.files["backgroundImage"][0].filename
                );
                }
                return res.status(404).json({
                status: httpsStatusText.FAIL,
                data: "email already exist",
                });
            }
        }
        
        if(data.birthday){
            const today = new Date();
            data.age = today.getFullYear() - data.birthday.getFullYear();
        }

        let updateFields = { ...data };

        const user = await User.findById(req.user.id);

        // profile image
        if (req.files["profileImage"] && req.files["profileImage"][0].path) {
        if (
            user &&
            user.profileImage_public_id &&
            user.profileImage_public_id !==
            "facebook/users/profile/jibu3d0moicrpb3lusg2"
        ) {
            await cloudinary.uploader.destroy(user.profileImage_public_id);
        }

        updateFields.profileImage = req.files["profileImage"][0].path;
        updateFields.profileImage_public_id =
            req.files["profileImage"][0].filename;
        }

        // background image
        if (req.files["backgroundImage"] && req.files["backgroundImage"][0].path) {
        if (
            user &&
            user.backgroundImage_public_id &&
            user.backgroundImage_public_id !==
            "Facebook/users/background/hyqdkbfl8dw49y9tz9rl"
        ) {
            await cloudinary.uploader.destroy(user.backgroundImage_public_id);
        }

        updateFields.backgroundImage = req.files["backgroundImage"][0].path;
        updateFields.backgroundImage_public_id =
            req.files["backgroundImage"][0].filename;
        }

        await User.updateOne({ _id: req.user.id }, updateFields);

        const newUpdataUser = await User.findOne(
        { _id: req.user.id },
        { password: 0, logged: 0, __v: 0, _id: 0 }
        );

        const view = {
        name: newUpdataUser.name,
        email: newUpdataUser.email,
        role: newUpdataUser.role,
        age: newUpdataUser.age,
        gender: newUpdataUser.gender,
        address: newUpdataUser.address,
        city: newUpdataUser.city,
        birthday: newUpdataUser.birthday,
        bio: newUpdataUser.bio,
        profileImage: newUpdataUser.profileImage,
        backgroundImage: newUpdataUser.backgroundImage,
        };

        res
        .status(200)
        .json({ status: httpsStatusText.SUCCESS, data: view });
    } catch (err) {
        // clean temp uploaded images
        if (
        req.files["profileImage"] &&
        req.files["profileImage"][0].path &&
        req.files["profileImage"][0].filename !==
            "facebook/users/profile/jibu3d0moicrpb3lusg2"
        ) {
        await cloudinary.uploader.destroy(req.files["profileImage"][0].filename);
        }
        if (
        req.files["backgroundImage"] &&
        req.files["backgroundImage"][0].path &&
        req.files["backgroundImage"][0].filename !==
            "Facebook/users/background/hyqdkbfl8dw49y9tz9rl"
        ) {
        await cloudinary.uploader.destroy(
            req.files["backgroundImage"][0].filename
        );
        }

        res
        .status(500)
        .json({ status: httpsStatusText.ERROR, message: "server error" });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({status: httpsStatusText.FAIL, message: "User not found" });
    }
    const resetCode = crypto.randomInt(100000, 999999).toString();
    user.resetCode = resetCode;
    user.resetCodeExpire = Date.now() + (60*60*1000); // 1 hour ===> m * s(60) * ms(1000)
    await user.save();
    
    await transporter.sendMail({
        from: `"Support Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Code",
        text: `Your password reset code is: ${resetCode}`,
    });

    res.json({status: httpsStatusText.SUCCESS, message: "Reset code sent to email" });
};

const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({
        email,
        resetCode: code,
        resetCodeExpire: { $gt: Date.now() }, 
    });

    if (!user) {
        return res.status(400).json({status: httpsStatusText.FAIL, message: "Invalid or expired code" });
    }

    //  new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // delete code  
    user.resetCode = undefined;
    user.resetCodeExpire = undefined;
    await user.save();

    res.json({status: httpsStatusText.SUCCESS, data: "Password reset successfully" });
};


module.exports = {
    getAllUsers ,
    getSingleUser ,
    imageUser ,
    search ,
    register ,
    login ,
    logout,
    check ,
    profile ,
    updateProfile ,
    forgotPassword ,
    resetPassword
} ;