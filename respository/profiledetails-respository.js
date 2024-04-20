const CrudRespository = require('./crud-respository')
const Profile = require('../models/Profile')

class ProfileRespository extends CrudRespository {
    constructor() {
        super(Profile);
    }   
}





module.exports = ProfileRespository;
