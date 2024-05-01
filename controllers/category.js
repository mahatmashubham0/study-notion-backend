const Category = require("../models/Category");
const { SuccessResponse, errorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");

const createCategory = async (req, res) => {
  try {
    // get data from user
    const { name, description } = req.body;

    // check validation
    if (!name || !description) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ errorResponse });
    }

    // create entry in db
    const category = await Category.create({
      name: name,
      description: description,
    });
    SuccessResponse.message = "Sucessfully created the category";
    SuccessResponse.data = category;
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while creatig category";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const getAllCategories = async (req,res) => {
  try {
    const categories = await Category.find();
    SuccessResponse.data = categories;
    SuccessResponse.message = "Sucessfully get all the tag";
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while fetchig all categories";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const categoryPageDetails = async (req,res) => { // it is used for fetching course according the categories
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
  createCategory,
  getAllCategories,
  categoryPageDetails,
};
