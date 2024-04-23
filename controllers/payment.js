const mongoose = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mail-sender");
const { json } = require("express");

// Capture the payment and initiate the RAzorpay order

exports.capturePayment = async () => {
  try {
    //get courseId and UserId
    const userId = req.user.id;
    const { courseId } = req.body;

    // validation
    if (!courseId || !userId) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // valid courseId
    const courseDetails = Course.findById(courseId);
    if (!courseDetails) {
      errorResponse.message = "Please Provide valid Course ID";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // user already pay for the course or not
    const uid = new mongoose.Types.ObjectId(userId); //userId we have as string we need to convert into object
    if (courseDetails.studentEnrolled.includes(uid)) {
      errorResponse.message = "Student is already Enrolled";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // order create
    const amount = courseDetails.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: courseId,
        userId,
      },
    };

    try {
      // initaite the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      SuccessResponse.message = "Sucessfully Enrolled in course";
      SuccessResponse.data = paymentResponse;
      return res.status(StatusCodes.CREATED).json({
        SuccessResponse,
        courseName: courseDetails.courseName,
        courseDescription: courseDescription,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amunt: paymentResponse.currency,
      });
    } catch (error) {
      errorResponse.message = "error generating while paying";
      errorResponse.error = error;
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }
  } catch (error) {
    errorResponse.message = "error generating while paying Section";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

// verify Payment for razorpay

exports.verifyPayment = async () => {
  const webHookSecret = "123456";

  const signature = req.headers["x-razorpay-signature"];

  const shaSum = crypto.createHmac("sha256", webHookSecret);
  shaSum.update(json.stringify(req.body));
  const digest = shaSum.digest("Hex");

  if (signature === digest) {
    console.log("payment is authorized");

    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // find course and enroll student on studentEnrolled array
      const enrolledCourse = await Course.findById(
        { _id: courseId },
        {
          $push: {
            studentEnrolled: userId,
          },
        },
        { new: true }
      );
      if (!enrolledCourse) {
        errorResponse.message = "Course Not Found";
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ errorResponse });
      }
      console.log(enrolledCourse);

      // find user and also update the course on array

      const enrolledStudent = await Course.findByIdAndUpdate(
        { _id: userId },
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );
      if (!enrolledStudent) {
        errorResponse.message = "User Not Found";
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ errorResponse });
      }
      console.log(enrolledStudent);

      // send mail to user once confirm this step
      const emailRespose = await mailSender(
        enrolledStudent.email,
        "You Enrolled Successfully on course"
      );
      console.log(emailRespose);

      // return response
      SuccessResponse.message =
        "Sucessfully Signature Verified and course added on enrolled";
      SuccessResponse.data = emailRespose;
      return res.status(StatusCodes.CREATED).json({
        SuccessResponse,
        courseUpdate: enrolledCourse,
        userUpdate: enrolledStudent,
      });
    } catch (error) {
      errorResponse.message = "error generating while signature verified";
      errorResponse.error = error;
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // when dont match signature
  } else {
    errorResponse.message = "signature not verified";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};
