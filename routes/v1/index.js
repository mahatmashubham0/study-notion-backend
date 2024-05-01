const express = require('express')
const usersRoutes = require('./user-routes')
const profileRoutes = require('./profile-routes')
const CourseRoutes = require('./course-routes')

const router = express.Router();

router.use('/auth' , usersRoutes)

router.use('/profile' , profileRoutes)

router.use('/courses' , CourseRoutes)

// router.use('/payment' , usersRoutes)

// router.use('/reach' , usersRoutes)


module.exports = router