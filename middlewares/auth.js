const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SuccessResponse, errorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");

// auth it check You are real user or not after login add jwt token in website and if u perform futher operation of this current website so
// this auth check the authentication of the user
exports.auth = async (req,res,next) => {
  try {
    // extract the token and
    const token = 
			// req.cookies.token ||
			req.body.token ||
			// req.header("Authorization").replace("Bearer ", "");

    //if token not present give response
    console.log("token",token)
    if (!token) {
      errorResponse.message = "Token is missing";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // verify the token if present the token
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("req.user obbject ==>",decode);
      req.user = decode;
    } catch (error) {
      errorResponse.message = "Token is invalid ! Please login Again";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }
  } catch (error) {
    errorResponse.message = "Something went wrong while check authentication of token";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
  next()
};

// is Student or not
exports.isStudent = async (req,res,next) => {
  try {
    if(req.user.role !== "Student") {
      errorResponse.message = "this is only for Student"
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR),json({errorResponse})
    }

    next();
  } catch (error) {
      errorResponse.message = "Something went wrong while check is Student of not ";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
}

exports.isInstructor = async (req,res,next) => {
  try {
    if(req.user.accountType !== "Instructor") {
      errorResponse.message = "this is only for Instructor"
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR),json({errorResponse})
    }

    next();
  } catch (error) {
      errorResponse.message = "Something went wrong while check is Student of not ";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
}

exports.isAdmin = async (req,res,next) => {
  try {
    if(req.user.accountType !== "isAdmin") {
      errorResponse.message = "this is only for isAdmin"
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR),json({errorResponse})
    }

    next();
  } catch (error) {
      errorResponse.message = "Something went wrong while check is Student of not ";
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
}