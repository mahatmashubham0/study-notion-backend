const { SubSectionRespository } = require("../respository");
const { StatusCodes } = require("http-status-codes");
// const AppError = require("../utils/app-error");

const subSectionRespository = new SubSectionRespository();

async function createsubSection(data) {
  try {
    const subsection = await subSectionRespository.create(data);
    return subsection;
  } catch (error) {
    // if (error.name == "SequelizeValidationError") {
    //   let explanation = [];
    //   error.errors.forEach((err) => {
    //     explanation.push(err.message);
    //   });
    //   throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    // }
    throw new AppError(
      "cannot a create a new section",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllsubSections() {
  try {
    const subsections = await subSectionRespository.getAll();
    return subsections;
  } catch (error) {
    throw new AppError(
      "cannot a fetch all section",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}


module.exports = {
  createsubSection,
  getAllsubSections,
};
