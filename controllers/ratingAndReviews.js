const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

const createRatingAndReviews = async () => {
  try {
    // fetch the data
    const { rating, review, courseId } = req.body;
    const { userId } = req.user.id;

    // validation
    if (!rating || !review || !courseId || !userId) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    //  check user enroll or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      errorResponse.message = "Student is not enrolled";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // check  user is already give review or not in this website user can give one time review
    const alreadyReview = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (!courseDetails) {
      errorResponse.message = "Student is already reviewd";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // create and ratingAndReview
    const ratingandaeview = await RatingAndReview.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });

    // update the course with rating and review
    await Course.findByIdAndUpdate(courseId, {
      $push: {
        ratingAndReview: ratingandaeview._id,
      },
    });

    // return response
    SuccessResponse.message = "Sucessfully create the rating and review";
    SuccessResponse.data = ratingAndReview;
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while creating ratingAndreview";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const getAvgRatingAndReviews = () => {
  try {
    // get courseId beacuse we know ratingAndReview is given to the course if we want ratingandreview so we should give one course and get
    // rating and review according that course
    const { courseId } = req.body;

    // calculate rating and review
    const result = RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $gourp: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // return avrage rating
    if (result.lenght > 0) {
      SuccessResponse.message = "if Course has rating";
      SuccessResponse.data = result[0].averageRating;
      return res.status(StatusCodes.CREATED).json({ SuccessResponse });
    }

    // if rating is not present return response
    SuccessResponse.message = "when THis course dont have any rating anc review";
    SuccessResponse.data = 0;
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message =
      "error generating while getting avg ratingAndreview";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const getAllcreateRatingAndReviews = () => {
  try {
    // get all ratingandaeview 
    const ratingandaeview = RatingAndReview.find({}).sort({rating: "desc"})
                                                    .populate({
                                                      path: "User",
                                                      select: "firstName , lastName , email , image"
                                                    })
                                                    .populate({
                                                      path: "Course",
                                                      select: "courseName"
                                                    })
    ;

    // return response
    SuccessResponse.data = ratingandaeview;
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

module.exports = {
  getAvgRatingAndReviews,
  createRatingAndReviews,
  getAllcreateRatingAndReviews,
};
