const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next) => {
    const header = req.headers['authorization'] || req.headers['Authorization'];
    let token;

    if (header) {
        token = header.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: httpStatusText.ERROR,
                message: "token not found",
            });
        }
    } else {
        return res.status(401).json({
        status: httpStatusText.ERROR,
        message: "header not found",
        });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
        status: httpStatusText.FAIL,
        data: err.message,
        });
    }
};

module.exports = { verifyToken };
