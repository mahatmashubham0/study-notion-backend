const { errorResponse, SuccessResponse } = require("../utils/common");
const Section = require("../models/Section");
const Course = require("../models/Course");
const {StatusCodes} = require('http-status-codes')

const createSection = async (req,res) => {
  try {
    // get data from ui
    const { sectionName, courseId } = req.body;

    // validation
    if (!sectionName || !courseId) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    //create the section
    const section = await Section.create({ sectionName });

    // update the course table with section objectId
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: section._id,
        },
      },
      { new: true }
    );
    // return response
    SuccessResponse.message = "Sucessfully created the New Section";
    SuccessResponse.data = {section , updatedCourse};
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while creatig Section";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
  };


const updateSection = async (req,res) => {
    try {
      // get data from ui
      const { sectionName, sectionId } = req.body;
  
      // validation
      if (!sectionName || !courseId) {
        errorResponse.message = "Please fill all field";
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ errorResponse });
      }
  
      // update the section table
      const updatedCourse = await sectionServices.updateSection(
        sectionId, {sectionName}  
      );
      // return response
      SuccessResponse.message = "Sucessfully updated the Section";
      SuccessResponse.data = updatedCourse;
      return res.status(StatusCodes.CREATED).json({ SuccessResponse });
    } catch (error) {
      errorResponse.message = "error generating while updating Section";
      errorResponse.error = error;
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }
  };


const deleteSection = async (req,res) => {
    try {
      // get data from ui
      const {sectionId } = req.params;
  
      // validation
      if (!courseId) {
        errorResponse.message = "Please fill all field";
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ errorResponse });
      }
  
      // delete the section
      const updatedCourse = await sectionServices.deleteSection(sectionId);  

      // return response
      SuccessResponse.message = "Sucessfully deleted the Section";
      SuccessResponse.data = updatedCourse;
      return res.status(StatusCodes.CREATED).json({ SuccessResponse });
    } catch (error) {
      errorResponse.message = "error generating while deleting Section";
      errorResponse.error = error;
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }
  };


const getAllSections = async (req,res) => {
    try {
      const sections = sectionServices.getAllSections();
      SuccessResponse.data = sections;
      SuccessResponse.message = "Sucessfully get all the sections";
      return res.status(StatusCodes.CREATED).json({ SuccessResponse });
    } catch (error) {
      errorResponse.message = "error generating while fetchig all sections";
      errorResponse.error = error
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }
  };

module.exports = {
  createSection,
  getAllSections,
  updateSection,
  deleteSection
};
