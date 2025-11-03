const Post = require('../models/posts_modules');
const User = require('../models/user_modules');
const  httpsStatusText  =  require('../utils/httpStatusText') ; 
const { validationResult , matchedData} =  require('express-validator') ; 
const Roles = require('../utils/roles');
const cloudinary = require("cloudinary").v2;


// Create post
const createPost = async (req, res) => {
    try{
        const errors = validationResult(req) ;
        if(!errors.isEmpty()) {
            if (req.file && req.file.path) {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
            return res.status(400).json({status:httpsStatusText.FAIL , data:errors.array()})
        }
        
        const data = matchedData(req) ;
        data.authorId = req.user.id;
        
        let post;    
        if(req.file && req.file.path){
            post = new Post({...data , images: req.file.path , images_public_id: req.file.filename}); 
        }
        else{
            post = new Post(data); 
        } 
        await post.save() ; 

        return res.status(201).json({status:httpsStatusText.SUCCESS , data:"upload successfully"}) ;
    }
    catch(err){
        if (req.file && req.file.path) {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

//Get Single user
const getSinglePost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.postId) ;  
        res.status(200).json({
            status:httpsStatusText.SUCCESS,
            data:post 
        });     
        
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

// Get all public posts
const getAllPublicPosts = async (req, res) => {
    try {
        const visitor = await User.findById(req.user.id); // logged-in user
        const myFriends = visitor.friends || [];
        
        // Fetch public posts
        let posts = await Post.find({ visibility: "public" }, { __v:0, images_public_id:0 })
                            .populate("authorId", "name profileImage")
                            .sort({ createdAt: -1 });

        // Fetch friends-only posts from friends
        const friendsPosts = await Post.find({ 
        visibility: "friends", 
        authorId: { $in: myFriends } 
        }, { __v:0, images_public_id:0 })
        .populate("authorId", "name profileImage");

        // Fetch logged-in user's own posts (all visibility)
        const myPosts = await Post.find({ authorId: req.user.id , visibility: "friends" }, { __v:0, images_public_id:0 })
                                .populate("authorId", "name profileImage");

        // Merge all posts
        posts.push(...friendsPosts, ...myPosts);

        // Sort all by createdAt descending
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json({ status: httpsStatusText.SUCCESS, data: posts });
    } 
    catch(err){
        return res.status(500).json({ status: httpsStatusText.ERROR, message: err.message });
    }
}

// Get posts of friends (feed)
const getFriendsPosts = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        const posts = await Post.find({ authorId: { $in: user.friends  } ,visibility: { $ne: "private" } } , {__v:0 , images_public_id:0})
            .populate("authorId", "name profileImage")
            .sort({ createdAt: -1 });
        res.json({status:httpsStatusText.SUCCESS,data:posts});
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

// Get posts of one user (profile)
const getUserPosts =  async (req, res) => {
    try{
        if(req.params.userId === req.user.id) return res.status(200).json({status:httpsStatusText.SUCCESS,data:"this is your profile"}) ; 
        const posts = await Post.find({ authorId: req.params.userId , visibility: { $nin: ["private" , "friends"] }} , {__v:0 , images_public_id:0})
            .populate("authorId", "name profileImage")
            .sort({ createdAt: -1 });

        const visitor = await User.findById(req.user.id);
        const myfriend = visitor.friends.includes(req.params.userId);

        if (myfriend || req.user.role === Roles.ADMIN) {
            const friendsPosts = await Post.find({ authorId: req.params.userId , visibility: "friends" }) ; 
            posts.push(...friendsPosts);
        }
        if(req.user.role === Roles.ADMIN)
        {
            const privatePost = await Post.find({ authorId: req.params.userId , visibility: "private" }) ; 
            posts.push(...privatePost) ;
        }
        res.json({status:httpsStatusText.SUCCESS,data:posts});
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

// edit post
const editPost = async (req, res) => {
    try{
        const error  =  validationResult(req) ; 
        if(!error.isEmpty()){
            if (req.file && req.file.path) {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
            return res.status(400).json({status:httpsStatusText.ERROR , message:error.array()}) ;
        };
        
        const data =  matchedData(req) ;        
        const post = await Post.findById(data.postId);

        if(req.user.id.toString() !== post.authorId.toString()) return res.status(401).json({status:httpsStatusText.FAIL , data:"you are not authorized to edit this post"}) ; 
        
        if (req.file && req.file.path) {            
            if (post && post.images_public_id) {
                await cloudinary.uploader.destroy(post.images_public_id);
            }             
            await Post.updateOne({ _id: data.postId },{ ...data,  images: req.file.path ,  images_public_id: req.file.filename});
        } 
        else {
            await Post.updateOne({ _id: data.postId }, { ...data });
        }
        
        const  newUpdataPost  =  await Post.findOne({_id:data.postId} , {__v:0 , images_public_id:0}) ;
        
        res.status(200).json({
            status:httpsStatusText.SUCCESS,
            data:newUpdataPost 
        }); 
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

// Delete post
const deletePost = async (req, res) => {
    try{
        const error  =  validationResult(req) ; 
        if(!error.isEmpty()) return res.status(400).json({status:httpsStatusText.ERROR , message:error.array()}) ;
        const post = await Post.findById(req.params.postId);
        
        if (!post) return res.status(404).json({status:httpsStatusText.FAIL , data:"post not found"});
        
        if (post.authorId.toString() !== req.user.id.toString() && req.user.role !== Roles.ADMIN) return res.status(401).json({status:httpsStatusText.FAIL , data:"you are not authorized to delete this post"});
        if (post.images_public_id.length > 0) {
            await cloudinary.uploader.destroy(post.images_public_id);
        }
        await Post.deleteOne({ _id: req.params.postId });
        res.json({status:httpsStatusText.SUCCESS , data:"post deleted successfully"});
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

module.exports = {
    createPost,
    getSinglePost,
    editPost,
    getAllPublicPosts,
    getFriendsPosts,
    getUserPosts , 
    deletePost
}

