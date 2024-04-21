const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const mailSender = require("../utils/main-sender");
const { errorResponse, SuccessResponse } = require("../utils/common");
const bcrypt = require("bcrypt");

const resetPasswordToken = async (req, res) => {
  try {
    // get email from user
    const { email } = req.body;

    // check user exit for that email and validation
    const user = await User.findOne({ email: email });
    if (!user) {
      errorResponse.message = "User not Exit first Signup";
      return res.status(StatusCodes.NOT_FOUND).json({ errorResponse });
    }

    // generate token using this token we can create the expire time
    const token = crypto.randomUUID();
    console.log("token for Sending mail", token);

    // update user database by adding the token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordToken1: Date.now() + 5 * 60 * 1000 },
      { noew: true }
    );

    // create url
    const url = `http://localhost:3000/update-passowrd/${token}`;

    // using above token perform sending mail functionality send mail on email
    await mailSender(
      email,
      "Password reset Link",
      `Password reset Link ${url}`
    );

    // return response
    SuccessResponse.message =
      "Email sent successfully , please check email and update password";
    return res.status(StatusCodes.OK).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message =
      "Something went wrong while send mail on email for chaning the password";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

// resetPassword

const resetPassword = async (req, res) => {
  try {
    // fetch data from email
    const { password, confirmPassword, token } = req.body;

    // validation
    if (password == confirmPassword) {
      errorResponse.message = "password not matching";
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errorResponse });
    }

    // get user detail using token && if no token --> invalid token
    const user = await User.findOne({ token: token });
    if (!user) {
      errorResponse.message = "token is invalid";
      return res.status(StatusCodes.NOT_FOUND).json({ errorResponse });
    }

    // check timing for token
    if (user.resetPasswordExpries < Date.now()) {
      errorResponse.message = "token is Expried , Please reregerated the token";
      return res.status(StatusCodes.NOT_FOUND).json({ errorResponse });
    }

    // hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // passowrd update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashPassword },
      { new: true }
    );

    // return response
    SuccessResponse.message = "Sucessfully password changed";
    return res.status(StatusCodes.OK).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message =
      "Something went wrong while Change the password";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

module.exports = {
    resetPasswordToken,
    resetPassword
}
