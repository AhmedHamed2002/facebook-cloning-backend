const User = require("../models/user_modules");
const httpStatusText = require("../utils/httpStatusText");
const { validationResult , matchedData} = require("express-validator");


// Send friend request
const sendFriendRequest = async (req, res) => {
    try{
        const error  =  validationResult(req) ; 
        if(!error.isEmpty()) return res.status(400).json({status:httpStatusText.ERROR , message:error.array()}) ;
        const data =  matchedData(req) ;
        if(req.user.id ===  data.toId) return res.status(400).json({status:httpStatusText.FAIL , message: "You cannot send a friend request to yourself"})
        await User.findByIdAndUpdate(data.toId, { $addToSet: { friendRequests: req.user.id } });
        res.json({status:httpStatusText.SUCCESS , data: "Friend request sent!" });
    }
    catch(err){
        res.status(500).json({status:httpStatusText.ERROR , message: err.message });
    }
}

// Accept friend request
const acceptFriendRequest = async (req, res) => {
    try{
        const error  =  validationResult(req) ; 
        if(!error.isEmpty()) return res.status(400).json({status:httpStatusText.ERROR , message:error.array()}) ;
        const data =  matchedData(req) ;
        if(req.user.id ===  data.fromId) return res.status(400).json({status:httpStatusText.FAIL , message: "You cannot accept a friend request from yourself"})
        await User.findByIdAndUpdate(data.fromId, { $addToSet: { friends: req.user.id } });
        await User.findByIdAndUpdate(req.user.id, { 
            $addToSet: { friends: data.fromId },
            $pull: { friendRequests: data.fromId }
        });
        res.json({status:httpStatusText.SUCCESS , message: "Friend request accepted!" });
    }
    catch(err){
        res.status(500).json({status:httpStatusText.ERROR , message: err.message });
    }
}

// Reject friend request
const rejectFriendRequest = async (req, res) => {
    try {
        const error = validationResult(req); 
        if (!error.isEmpty()) {
            return res.status(400).json({ status: httpStatusText.ERROR, message: error.array() });
        }

        const data = matchedData(req);

        if (req.user.id === data.fromId) {
            return res.status(400).json({ status: httpStatusText.FAIL, message: "You cannot reject a friend request from yourself" });
        }

        // 👇 check if request exists
        const user = await User.findById(req.user.id);
        if (!user.friendRequests.includes(data.fromId)) {
            return res.status(400).json({ status: httpStatusText.FAIL, message: "No friend request from this user" });
        }

        // remove the request only
        await User.findByIdAndUpdate(req.user.id, { 
            $pull: { friendRequests: data.fromId }
        });

        res.json({ status: httpStatusText.SUCCESS, message: "Friend request rejected!" });
    } catch (err) {
        res.status(500).json({ status: httpStatusText.ERROR, message: err.message });
    }
};

// Remove friend
const removeFriend = async (req, res) => {
    try{
        const error  =  validationResult(req) ; 
        if(!error.isEmpty()) return res.status(400).json({status:httpStatusText.ERROR , message:error.array()}) ;
        const data =  matchedData(req) ;
        
        if(req.user.id ===  data.friendId) return res.status(400).json({status:httpStatusText.FAIL , message: "You cannot remove yourself from your friends list"})
        await User.findByIdAndUpdate(req.user.id, { $pull: { friends: data.friendId } });
        await User.findByIdAndUpdate(data.friendId, { $pull: { friends: req.user.id } });
        res.json({status:httpStatusText.SUCCESS , message: "Friend removed!" });
    }
    catch(err){
        res.status(500).json({status:httpStatusText.ERROR , message: err.message });
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
};