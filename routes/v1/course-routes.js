const express = require("express");

const {
  createCategory,
  getAllCategories,
  categoryPageDetails,
} = require("../../controllers/category");

const { createCourse , getCourseDetails } = require("../../controllers/course");

const { createSection } = require("../../controllers/section");

const { createSubSection } = require("../../controllers/subSection");

//  middlewares 
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../../middlewares/auth");

const router = express.Router();

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", getAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// // Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// //Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// // Update a Section
// router.post("/updateSection", auth, isInstructor, updateSection)
// // Delete a Section
// router.post("/deleteSection", auth, isInstructor, deleteSection)
// // Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// // Edit Sub Section
// router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// // Delete Sub Section
// router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// // Get all Registered Courses
// router.get("/getAllCourses", getAllCourses)
// // Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// // Get Details for a Specific Courses
// router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// // Edit Course routes
// router.post("/editCourse", auth, isInstructor, editCourse)
// // Get all Courses Under a Specific Instructor
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// // Delete a Course
// router.delete("/deleteCourse", deleteCourse)
// // update the course
// router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
// router.post("/createRating", auth, isStudent, createRating)
// router.get("/getAverageRating", getAverageRating)
// router.get("/getReviews", getAllRating)

module.exports = router;
