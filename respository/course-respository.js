const CrudRespository = require('./crud-respository')
const Course = require('../models/Course')

class CourseRespository extends CrudRespository {
    constructor() {
        super(Course);
    }   
}


module.exports = CourseRespository;
