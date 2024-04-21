const otpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, errorResponse } = require("../utils/common");
const bcrypt = require("bcrypt");
const { userServices, profileServices } = require("../services");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const sendOTP = async () => {
  try {
    // takee email from user
    const { email } = req.body;

    // otp generated here
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Otp Is generated", OTP);

    // check it is Unique OTP or not
    let checkUniqueOTp = await Otp.findOne({ OTP });
    while (checkUniqueOTp) {
      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }
    checkUniqueOTp = await Otp.findOne({ OTP });

    const payLoadData = { email, OTP };
    const otpBody = await Otp.create({ payLoadData });
    console.log(otpBody);

    SuccessResponse.data = OTP;
    SuccessResponse.message = "Otp is Generated Successfully";
    return res.status(StatusCodes.OK).json({ SuccessResponse });
  } catch (error) {
    console.log(error.message);
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const SingUp = async () => {
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
    } = req.bdoy;

    //check validation
    if (!fullName || !lastName || !email || !password || !accountType || !otp) {
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
    if (!recentOtpObject) {
      errorResponse.message = "Otp Not Fund";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    } else {
      if (otp !== recentOtpObject.otp) {
        // here this otp is comming from user and another is comming from email
        errorResponse.message = "Otp invalid";
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ errorResponse });
      }
    }

    // hash password
    const hashPassword = bcrypt.hash(password, 10);

    // create dome profiledetails
    const profiledetails = await profileServices.createProfile({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    //create the enrty in db
    const user = await userServices.createUser({
      firstName,
      lastName,
      email,
      password: hashPassword,
      accountType,
      additionalDetails: profiledetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      courseProgress,
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

const Login = async () => {
  try {
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
    const user = await User.findOne({ email }).populate("additonalDetails");

    // generate jwt token and matching the password
    if (bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        role: user.accountType,
        id: user._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      (user.token = token), (user.password = undefined);
    }

    // CREATE cookei and send response
    const options = {
      expires: new Date(Date.now() + 3 * 34 * 60 * 1000),
      httpeOnly: true,
    };
    SuccessResponse.message = "User successfully Logged";
    SuccessResponse.data = user;
    return res
      .cookie("token", token, options)
      .status(StatusCodes.OK)
      .json({ SuccessResponse });
  } catch (error) {
    console.log(error.message);
    errorResponse.message = "User can not login"
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const changePassword = async () => {
    // get data from user
    // get old password , newpassowrd , confirmPassword,
    // validation
    // update password in DB,
    // send mail -- updated password
    // return response
}

module.exports = {
  sendOTP,
  SingUp,
  Login
};
