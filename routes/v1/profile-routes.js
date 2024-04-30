const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../../middlewares/auth")
const {
  deletAccount,
  updateProfile,
  getUserById,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../../controllers/profileDetails")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deletAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getUserById)
// Get Enrolled Courses
// router.get("/getEnrolledCourses", auth, getEnrolledCourses)
// router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router