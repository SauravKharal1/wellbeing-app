const Datastore = require('nedb-promises');
const db = Datastore.create({ filename: './data/achievements.db', autoload: true });

class Achievement {
  constructor({ _id, userId, goalId, description, date }) {
    this._id = _id;
    this.userId = userId;
    this.goalId = goalId;
    this.description = description;
    this.date = date;
  }

  static async findByUserId(userId) {
    const achievements = await db.find({ userId });
    return achievements.map(achievement => new Achievement(achievement));
  }

  static async findById(id) {
    const achievement = await db.findOne({ _id: id });
    if (!achievement) return null;
    return new Achievement(achievement);
  }

  async save() {
    const achievement = await db.insert(this);
    return new Achievement(achievement);
  }

  static async updateById(id, updatedData) {
    await db.update({ _id: id }, { $set: updatedData });
  }

  static async deleteById(id) {
    await db.remove({ _id: id });
  }
}

module.exports = Achievement;
