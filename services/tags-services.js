const { TagRespository } = require("../respository");
const { StatusCodes } = require("http-status-codes");
// const AppError = require("../utils/app-error");

const tagRespository = new TagRespository();

async function createTag(data) {
  try {
    const user = await tagRespository.create(data);
    return user;
  } catch (error) {
    // if (error.name == "SequelizeValidationError") {
    //   let explanation = [];
    //   error.errors.forEach((err) => {
    //     explanation.push(err.message);
    //   });
    //   throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    // }
    throw new AppError(
      "cannot a create a new user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllTags() {
  try {
    const tags = await tagRespository.getAll();
    return tags;
  } catch (error) {
    throw new AppError(
      "cannot a create a new user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}


module.exports = {
  createTag,
  getAllTags,
};
