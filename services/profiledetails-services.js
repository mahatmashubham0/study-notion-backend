const {ProfileRespository} = require("../respository");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/app-error");

const profileRespository = new ProfileRespository();

async function createProfile(data) {
  try {
    const profile = await profileRespository.create();
    return profile;
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


async function updateProfile(id , data) {
  try {
    const profile = await profileRespository.findByIdAndUpdate(id , data);
    return profile;
  } catch (error) {
    // if (error.name == "SequelizeValidationError") {
    //   let explanation = [];
    //   error.errors.forEach((err) => {
    //     explanation.push(err.message);
    //   });
    //   throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    // }
    throw new AppError(
      "cannot a create a new profile",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function deleteProfile(id) {
  try {
    const profile = await profileRespository.findByIdAndDelete(id);
    return profile;
  } catch (error) {
    // if (error.name == "SequelizeValidationError") {
    //   let explanation = [];
    //   error.errors.forEach((err) => {
    //     explanation.push(err.message);
    //   });
    //   throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    // }
    throw new AppError(
      "cannot a create a new profile",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
    createProfile,
    updateProfile,
    deleteProfile
}