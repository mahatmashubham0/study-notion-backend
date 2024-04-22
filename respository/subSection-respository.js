const CrudRespository = require('./crud-respository')
const SubSection = require('../models/SubSection')

class UserRespository extends CrudRespository {
    constructor() {
        super(SubSection);
    }   
}


module.exports = UserRespository;
