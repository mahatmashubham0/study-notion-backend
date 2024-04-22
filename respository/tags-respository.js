const CrudRespository = require('./crud-respository')
const Tag = require('../models/Tag')

class UserRespository extends CrudRespository {
    constructor() {
        super(Tag);
    }   
}


module.exports = UserRespository;
