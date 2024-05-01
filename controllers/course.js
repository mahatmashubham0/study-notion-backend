const { SuccessResponse, errorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const imageUploadToCloudinary = require("../utils/image-uploader");
const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");

const createCourse = async (req, res) => {
  try {
    // get data from user
    let { courseName, courseDescription, price, whatYouWillLearn, tag , category, status } = req.body;

    // get thumbnails
    const thumbnails  = req.body.thumbnailImage;

    // check validation
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !whatYouWillLearn ||
      !tag ||
      !thumbnails ||
      !category
    ) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    if (!status || status === undefined) {
      status = "Draft"
    }

    // check instructor beacuse we want to store instructor object in course db
    const instructorId = req.user.id;
    const instructorDetails = await User.findById(instructorId);
    console.log(
      "both are some there is dount",
      instructorDetails._id,
      req.user.id
    );

    if (!instructorDetails) {
      errorResponse.message = "instructor not found";
      return res.status(StatusCodes.NOT_FOUND).json({ errorResponse });
    }
   
    // check given category is valid or not
    const categoryDetails = await Category.findById(category); // when we use the findById we dont need to give ({}) parameter only should give () and pass the unique data
    if (!categoryDetails) {
      errorResponse.message = "category not found";
      return res.status(StatusCodes.NOT_FOUND).json({ errorResponse });
    }



    //image upload on cloudinary
    // const thumbnailsImage = await imageUploadToCloudinary(
    //   thumbnails,
    //   process.env.FOLDER_NAME
    // );

    //create the entry in the db
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      price,
      whatYouWillLearn,
      instructor: instructorDetails._id,
      tag,
      category,
      status,
      thumbnails: "i will fix it",
    });

    // update user that user is instructor
    // add new course in user db that under the instrutor user
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //  update the tag schema
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    SuccessResponse.message = "Sucessfully created the New Course";
    SuccessResponse.data = newCourse;
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while creatig Course";
    errorResponse.error = error;
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const courses = courseServices.getAllCourse();
    SuccessResponse.data = courses;
    SuccessResponse.message = "Sucessfully get all the Courses";
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while fetchig all course";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const getCourseDetails = async (req, res) => {
  try {
    // fetch the data
    const { courseId } = req.body;

    // fetch the data in nested way
    const courses = await Course.findById(
      { _id: courseId })
      .populate(
        {
        path: "instructor",
        populate: { path: "additionalDetails" },
        }
      )
      .populate("category")
      // .populate("ratingAndReviews")
      .populate(
        {
          path: "courseContent",
          popolate:{
            path: "subSection"
          }
        }
      )
    .exec();

    // Validation
    if (!courses) {
      errorResponse.message = "Data Count not fetch";
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ errorResponse });
    }

    // return respone 
    SuccessResponse.data = courses;
    SuccessResponse.message = "Sucessfully get all the Courses with population";
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while fetchig course";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

module.exports = {
  createCourse,
  getAllCourse,
  getCourseDetails,
};
