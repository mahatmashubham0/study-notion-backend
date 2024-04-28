const express = require('express')
const {Login , sendOTP , SingUp , changePassword } = require('../../controllers/Auth');
const { auth } = require('../../middlewares/auth');
// const {checkUserExit} = require('../../middleware')

const router = express.Router();


// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", Login)

// Route for user signup
router.post("/signup", SingUp)

// Route for sending OTP to the user's email

router.post("/sendotp", sendOTP)

// Route for Changing the password
router.post("/changepassword",auth , changePassword)


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
// router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
// router.post("/reset-password", resetPassword)

module.exports = router