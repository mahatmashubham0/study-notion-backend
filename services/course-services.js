const { CourseRespository } = require("../respository");
const { StatusCodes } = require("http-status-codes");
// const AppError = require("../utils/app-error");

const courseRespository = new CourseRespository();

async function createCourse(data) {
  try {
    const course = await courseRespository.create(data);
    return course;
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

async function getAllCourse() {
  try {
    const courses = await courseRespository.getAll();
    return courses;
  } catch (error) {
    throw new AppError(
      "cannot a create a new user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}


module.exports = {
  createCourse,
  getAllCourse,
};
