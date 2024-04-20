const CrudRespository = require('./crud-respository')
const User = require('../models/User')

class UserRespository extends CrudRespository {
    constructor() {
        super(User);
    }   
}


module.exports = UserRespository;
