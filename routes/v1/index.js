const express = require('express')
// const booksRoutes = require('./book_routes')
const usersRoutes = require('./user-routes')

const router = express.Router();

router.use('/auth' , usersRoutes)

// router.use('/profile' , usersRoutes)

// router.use('/course' , usersRoutes)

// router.use('/payment' , usersRoutes)

// router.use('/reach' , usersRoutes)


module.exports = router