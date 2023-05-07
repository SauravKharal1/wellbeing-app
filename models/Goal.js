const Datastore = require('nedb-promises');
const db = Datastore.create({ filename: './data/goals.db', autoload: true });

class Goal {
  constructor({ _id, userId, category, description, startDate, endDate, completed }) {
    this._id = _id;
    this.userId = userId;
    this.category = category;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.completed = completed || false;
  }

  static async findByUserId(userId) {
    const goals = await db.find({ userId });
    return goals.map(goal => new Goal(goal));
  }

  static async findById(id) {
    const goal = await db.findOne({ _id: id });
    if (!goal) return null;
    return new Goal(goal);
  }

  async save() {
    const goal = await db.insert(this);
    return new Goal(goal);
  }

  static async updateById(id, updatedData) {
    await db.update({ _id: id }, { $set: updatedData });
  }

  static async deleteById(id) {
    await db.remove({ _id: id });
  }
}

module.exports = Goal;
