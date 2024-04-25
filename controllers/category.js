const Category = require("../models/Category");
const Tag = require("../models/Category");
const { tagServices } = require("../services");
const { SuccessResponse, errorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");

const createTag = async (req, res) => {
  try {
    // get data from user
    const { name, description } = req.body;

    // check validation
    if (!name || !description) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // create entry in db
    const tag = await tagServices.createTag({
      name: name,
      description: description,
    });
    SuccessResponse.message = "Sucessfully created the tag";
    SuccessResponse.data = tag;
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while creatig tags";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const getAllTags = async () => {
  try {
    const tags = tagServices.getAllTags();
    SuccessResponse.data = tags;
    SuccessResponse.message = "Sucessfully get all the tag";
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while fetchig all tags";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const categoryPageDetails = async () => {
  try {
    // get categoryId
    const { categoryId } = req.body;

    // get all courses for particular category
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    // validation
    if (!selectedCategory) {
      errorResponse.message = "Course is not present for particular category";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }
    
    // get different category courses
    const diffCategoryCourses = await Category.find({
                                            _id: {$ne: categoryId}
                                           }).populate("Courses").exec();
   
    // get top selling course


    // return response
    SuccessResponse.data = {selectedCategory , diffCategoryCourses};
    SuccessResponse.message = "Sucessfully get all the tag";
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while fetchig specific tags";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

module.exports = {
  createTag,
  getAllTags,
  categoryPageDetails,
};