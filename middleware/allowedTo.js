const httpStatusText = require('../utils/httpStatusText')
module.exports = (...roles) =>{
    return (req  , res  , next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(401).json({status : httpStatusText.FAIL , data:"only admin can access this route"}) ;
        }
        next() ; 
    }
}