const Profile = require("../models/Profile");
const User = require("../models/User");
const { profileServices } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { errorResponse, SuccessResponse } = require("../utils/common");

const updateProfile = async () => {
  try {
    // fetch data from UL
    const { gender, about = "", dateOfBirth = "" } = req.body;
    const UserId = req.user.id;
    const phoneNuber = req.body.contactNumber;

    // validation
    if (!gender || !about || !dateOfBirth || !contactNumber) {
      errorResponse.message = "Please fill all field";
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ errorResponse });
    }

    //find User and then get the id of ProfileDetails column
    const userDetails = await User.findById(UserId);
    const profileId = userDetails.id;
    const profileDetails = await Profile.findById(profileId);

    // upate the profile
    profileDetails.gender = gender; // check that we can update this way also
    profileDetails.about = about;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.contactNumber = phoneNuber;
    profileDetails.save();

    // another way to update
    // await = profileServices.updateProfile({_id:profileId} , {gender , about , dateOfBirth , contactNumber:phoneNuber})

    //return response
    SuccessResponse.message = "Sucessfully updated the Profile";
    SuccessResponse.data = profileDetails;
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while updating profile";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

const deletAccount = async () => {
  try {
    //get data
    const userId = req.user.id;

    //validation of user
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      errorResponse.message = "user Not found";
      errorResponse.error = error;
      return res.status(StatusCodes.NOT_FOUND).json({ errorResponse });
    }

    // first delete the profile and then delete user
    await profileServices.deleteProfile(userDetails.additionalDetails);
    const deleteAccount = await User.findByIdAndDelete({
      _id: userDetails._id,
    }); // {_id:userId} this is also can written

    SuccessResponse.message = "Sucessfully Deleted the Account";
    SuccessResponse.data = deleteAccount;
    return res.status(StatusCodes.OK).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while delete Account";
    errorResponse.error = error;
    return res.status(StatusCodes.NOT_FOUND).json({ errorResponse });
  }
};

const getUserById = async () => {
  try {
    // get user Id
    const UserId = req.user.id;

    //validation and get data according userId
    const userDetail = User.findById(UserId).populate("additionalDetails").exec(); // populate used for extra data which is associated with doucment.object.id

    // return response
    SuccessResponse.message = "Sucessfully get data according the Id";
    SuccessResponse.data = userDetail;
    return res.status(StatusCodes.CREATED).json({ SuccessResponse });
  } catch (error) {
    errorResponse.message = "error generating while getting userData";
    errorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errorResponse });
  }
};

module.exports = {
  updateProfile,
  deletAccount,
  getUserById,
};
