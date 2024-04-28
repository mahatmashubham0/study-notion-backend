const otpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
const Profile = require("../models/Profile");
const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, errorResponse } = require("../utils/common");
const {passwordUpdated} = require('../templates/passwordUpdate')
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mailSender = require('../utils/mail-sender')

const sendOTP = async (req, res) => {
  try {
    // takee email from user
    const { email } = req.body;
    console.log("Email:", email);

    // otp generated here
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Otp Is generated", OTP);

    // check it is Unique OTP or not
    let checkUniqueOTp = await Otp.findOne({ OTP });

    // find unique otp that not present on database
    while (checkUniqueOTp) {
      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      checkUniqueOTp = await Otp.findOne({ OTP });
    }

    // create entry in otp models
    const otpBody = await Otp.create({ email, otp: OTP });
    console.log(otpBody);

    // return response
    SuccessResponse.data = OTP;
    SuccessResponse.message = "Otp is Generated Successfully";
    return res.status(StatusCodes.OK).json({ SuccessResponse });
  } catch (error) {
    console.log("Error");
    console.log(error.message);
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const SingUp = async (req, res) => {
  try {
    //take data from user
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //check validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !accountType ||
      !otp
    ) {
      errorResponse.message = "Please Fill Every Field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    //check passowrd and confirmPassword
    if (password !== confirmPassword) {
      errorResponse.message = "Password are not match";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // find most recent otp
    const recentOtpObject = Otp.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("==>", recentOtpObject);

    // find Otp
    // if (recentOtpObject.length === 0) {
    //   // OTP not found for the email
    //   return res.status(400).json({
    //     success: false,
    //     message: "The OTP is not present",
    //   })
    // } else if (otp !== recentOtpObject[0].otp) {
    //   // Invalid OTP
    //   return res.status(400).json({
    //     success: false,
    //     message: "The OTP is not valid",
    //   })
    // }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create done profiledetails
    const profiledetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    //create the enrty in db
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType,
      additionalDetails: profiledetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return response
    (SuccessResponse.data = user),
      (SuccessResponse.message = "User Register Successfully");
    return res.status(StatusCodes.OK).json({ SuccessResponse });
  } catch (error) {
    errorResponse.error = error;
    errorResponse.message = "User can not Register";
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const Login = async (req, res) => {
  try {
    // some reason
    let token = "";

    // get data from user
    const { email, password } = req.body;

    //validation of data
    if (!email || !password) {
      errorResponse.message = "Please Fill All FIeld";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // check User exit or not
    const user = await User.findOne({ email }).populate("additionalDetails");

    // generate jwt token and matching the password
    if (bcrypt.compare(password, user.password)) {
      // bcrypt.compare(password, user.password) run this code then execute the if block
      const payload = {
        email: user.email,
        role: user.accountType,
        id: user._id,
      };
      token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });


      // set the user info to the token
      (user.token = token), (user.password = undefined);
    } else {
      errorResponse.message = "User passowrd not match";
      errorResponse.error = error;
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // CREATE cookei and send response
    const options = {
      expires: new Date(Date.now() + 3 * 34 * 60 * 1000),
      httpeOnly: true,
    };
    SuccessResponse.message = "User successfully Logged";
    SuccessResponse.data = { user, token };
    return res
      .cookie("token", token, options)
      .status(StatusCodes.OK)
      .json({ SuccessResponse });
  } catch (error) {
    console.log(error.message);
    errorResponse.message = "User can not login";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(  // mail-sender function take three argument email , message , html-body
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated( // this is template
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

module.exports = {
  sendOTP,
  SingUp,
  Login,
  changePassword,
};
