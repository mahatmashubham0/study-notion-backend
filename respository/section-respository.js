const CrudRespository = require('./crud-respository')
const Section = require('../models/Section')

class UserRespository extends CrudRespository {
    constructor() {
        super(Section);
    }   
}


module.exports = UserRespository;
