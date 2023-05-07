const Datastore = require('nedb-promises');
const db = Datastore.create({ filename: './data/users.db', autoload: true });

class User {
  constructor({ _id, username, password }) {
    this._id = _id;
    this.username = username;
    this.password = password;
  }

  static async findByUsername(username) {
    const user = await db.findOne({ username });
    if (!user) return null;
    return new User(user);
  }

  static async findById(id) {
    const user = await db.findOne({ _id: id });
    if (!user) return null;
    return new User(user);
  }

  async save() {
    const user = await db.insert(this);
    return new User(user);
  }

  // Implement any other user-related methods you need
}

module.exports = User;
