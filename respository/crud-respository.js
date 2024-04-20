const { StatusCodes } = require("http-status-codes");

class CrudRespository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }

  async destroy(data) {
    const response = await this.model.deleteOne({
      where: {
        id: data,
      },
    });
    if (!response) {
      // if id data is not present so destroy mthod give 0 and present so five 1 value inside the response variable
      throw new AppError("Not found the resourse", StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async getAll() {
    const response = await this.model.find();
    return response;
  }

  async findById(data) {
    const response = await this.model.findById(data);
    if (!response) {
      // if id data is not present so destroy mthod give 0 and present so five 1 value inside the response variable
      throw new AppError("Not found the resourse", StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async update(id, data) {
    const response = await this.model.updateOne({_id: id,}, {$set: {data}});
    if (!response) {
      // if id data is not present so destroy mthod give 0 and present so five 1 value inside the response variable
      throw new AppError("Not found the resourse", StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

module.exports = CrudRespository;
