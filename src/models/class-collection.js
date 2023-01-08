class Collection {
  constructor(model) {
    this.model = model;
  }
  async create(json) {
    let res = await this.model.create(json);
    return res;
  }
  async read(id = null) {
    let res;
    if (id) {
      res = await this.model.findOne({ where: { id } });
    } else {
      res = await this.model.findAll();
    }
    // id ? await this.model.findOne({where: { id }}) : record = await this.model.findAll()
    return res;
  }
  async update(json, id) {
    await this.model.update(json, { where: { id } });
    let res = await this.model.findOne({ where: { id } });
    return res;
  }
  async delete(id) {
    await this.model.destroy({ where: { id } });
    return 'This item has been deleted', id;
  }
}
module.exports = Collection;
