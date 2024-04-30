const express = require('express')
const {createCategory , getAllCategories , categoryPageDetails} = require('../../controllers/category');
const { auth , isAdmin } = require('../../middlewares/auth');
// const {checkUserExit} = require('../../middleware')

const router = express.Router();


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", getAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

module.exports = router