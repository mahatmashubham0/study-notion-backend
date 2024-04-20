const User = require('../models/User')
const {errorResponse} = require('../utils/common')
const {StatusCodes} = require('http-status-codes')

exports.checkUserExitOrNot =async  () => {
    try {
        const {email} = req.body;

        const userExit = await User.findOne({email});

        if(userExit) {
            errorResponse.message = "User already exit"
            return res.status(StatusCodes.OK).json({errorResponse})
        }
    } catch (error) {
        errorResponse.error = error;
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({errorResponse});
    }
}

