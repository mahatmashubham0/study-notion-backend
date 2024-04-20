const {UserRespository} = require("../respository");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/app-error");

const userRespository = new UserRespository();

async function createUser(data) {
  try {
    const user = await userRespository.create(data);
    return user;
  } catch (error) {
    // if (error.name == "SequelizeValidationError") {
    //   let explanation = [];
    //   error.errors.forEach((err) => {
    //     explanation.push(err.message);
    //   });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "cannot a create a new user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

module.exports = {
    createUser
}