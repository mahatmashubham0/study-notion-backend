const Tag = require("../models/Tag");
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
    errorResponse.error =  error
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
    errorResponse.error =  error
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

module.exports = {
  createTag,
  getAllTags
};
