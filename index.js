require('dotenv').config()
const httpStatusText = require('./utils/httpStatusText');
const express =  require('express');
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:3000"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

mongoose.connect(process.env.MONGO_URL);


// routers
const userRouter = require('./routes/user.route') ;
const postRouter = require('./routes/post.route') ;
const friendRouter = require('./routes/friend.route') ;
const reactionRouter = require('./routes/reaction.route') ;
const commentRoutes = require("./routes/comment.route");


// middle ware
app.use('/facebook/user' , userRouter ) ;
app.use('/facebook/post' , postRouter ) ;
app.use('/facebook/friend' , friendRouter ) ;
app.use('/facebook/reaction' , reactionRouter ) ;
app.use("/facebook/comments", commentRoutes) ;


app.use((req , res)=>{
    res.status(404).json({status:httpStatusText.ERROR , message:"this  resourse is not available"}) ;
}) ;  

app.listen(process.env.PORT||4000 ,() =>{
    console.log('server is running .....');
})

