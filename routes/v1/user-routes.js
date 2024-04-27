const express = require('express')
const {Login , sendOTP , SingUp } = require('../../controllers/Auth')
// const {checkUserExit} = require('../../middleware')

const router = express.Router();


// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
// router.post("/login", Login)

// Route for user signup
// router.post("/signup", SingUp)

// Route for sending OTP to the user's email

router.post("/sendotp", sendOTP)

// Route for Changing the password
// router.post("/changepassword", auth, authController.changePassword)


// router.post('/' , checkUserExit.checkUserExit,
//    userController.createUser)

// router.post('/signup' , checkUserExit.checkUserExit,
//    userController.RegisterUser)
// router.get('/login' , userController.loginUser)

// router.get('/' , userController.getAllUser)

// router.get('/:id' , userController.getUser)

// router.delete('/:id' , userController.destoryUser)

// router.patch('/:id' , userController.updateUser)

module.exports = router