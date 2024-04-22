const { SectionRespository } = require("../respository");
const { StatusCodes } = require("http-status-codes");
// const AppError = require("../utils/app-error");

const sectionRespository = new SectionRespository();

async function createSection(data) {
  try {
    const sections = await sectionRespository.create(data);
    return sections;
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

async function updateSection(id , data) {
  try {
    const sections = await sectionRespository.findByIdAndUpdate(id , data);
    return sections;
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

async function deleteSection(id) {
  try {
    const section = await sectionRespository.findByIdAndDelete(id);
    return section;
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

async function getAllSections() {
  try {
    const sections = await sectionRespository.getAll();
    return sections;
  } catch (error) {
    throw new AppError(
      "cannot a fetch all section",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}


module.exports = {
  createSection,
  getAllSections,
  updateSection,
  deleteSection
};
