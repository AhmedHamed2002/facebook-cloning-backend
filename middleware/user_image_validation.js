const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

    const uploadBoth = multer({
    storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
        if (file.fieldname === "profileImage") {
            return { folder: "Facebook/users/profile", allowed_formats: ["jpg", "png", "jpeg"] };
        }
        if (file.fieldname === "backgroundImage") {
            return { folder: "Facebook/users/background", allowed_formats: ["jpg", "png", "jpeg"] };
        }
        },
    }),
    })

module.exports =  uploadBoth ; 
