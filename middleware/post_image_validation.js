const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Facebook/posts",  
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});

module.exports = multer({ storage });