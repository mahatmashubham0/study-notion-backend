const Tag = require("../models/Tag");
const { courseServices } = require("../services");
const { SuccessResponse, errorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const imageUploadToCloudinary = require("../utils/image-uploader");
const User = require("../models/User");

const createCourse = async (req, res) => {
  try {
    // get data from user
    const { courseName, courseDescription, price, whatYouWillLeaen, tag } =
      req.body;

    // get thumbnails
    const { thumbnails } = req.files.thumbnailsFiles;

    // check validation
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !whatYouWillLeaen ||
      !tag ||
      !thumbnails
    ) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
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

    // check given tags is valid or not
    const tagDetails = await Tag.findById(tag); // when we use the findById we dont need to give ({}) parameter only should give () and pass the unique data
    if (!tagDetails) {
      errorResponse.message = "Tag not found";
      return res.status(StatusCodes.NOT_FOUND).json({ errorResponse });
    }

    //image upload on cloudinary
    const thumbnailsImage = await imageUploadToCloudinary(
      thumbnails,
      process.env.FOLDER_NAME
    );

    //create the entry in the db
    const newCourse = await courseServices.createCourse({
      courseName,
      courseDescription,
      price,
      whatYouWillLeaen,
      instructor: instructorDetails._id,
      tag: tagDetails._id,
      thumbnails: thumbnailsImage.secure_url,
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
    await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
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
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const getAllCourse = async () => {
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

const getCourse = async () => {
  try {
    // fetch the data
    const { courseId } = req.body;

    //
    const courses = await Course.findById(
      { _id: courseId }
      .populate(
        {
        path: "instructor",
        populate: { path: "additionalDetails" },
        }
      ).populate("category")
      .populate("ratingAndReviews")
      .populate(
        {
          path: "courseContent",
          popolate:{
            path: "subSection"
          }
        }
      )
    ).exec();

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
  getCourse,
};
