const CrudRespository = require("./crud-respository");
const Tag = require("../models/Category");

class UserRespository extends CrudRespository {
  constructor() {
    super(Tag);
  }
}

module.exports = UserRespository;
