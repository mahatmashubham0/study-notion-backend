const { errorResponse, SuccessResponse } = require("../utils/common");
const imageUploadToCloudinary = require("../utils/image-uploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {StatusCodes} = require('http-status-codes')

const createSubSection = async (req,res) => {
  try {
    // get data from ui
    const { title, timeDuration, description, sectionId } = req.body;
    const videoUrl = req.body;

    // validation
    if (!title || !timeDuration || !description || !videoUrl || !sectionId) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    // upload video n cloudinary
    // const uploadVideo = imageUploadToCloudinary(
    //   videoUrl,
    //   process.env.FOLDER_NAME
    // );

    //create the section
    const subSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: "i will fix it",
    });

    // update the Section table with subsection objectId
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSection._id,
        },
      },
      { new: true } // it means this line give us updated data
    );
    // return response
    SuccessResponse.message = "Sucessfully created the New subSection";
    SuccessResponse.data = updatedSection;
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while creatig subSection";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const getAllsubSections = async () => {
  try {
    const subSections = SubSection.find();
    SuccessResponse.data = subSections;
    SuccessResponse.message = "Sucessfully get all the SubSections";
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while fetchig all subSections";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

module.exports = {
  createSubSection,
  getAllsubSections,
};
