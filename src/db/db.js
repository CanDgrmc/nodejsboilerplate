const mongoose = require('mongoose');
const models = require('./models');

class DB {
  db;

  constructor(username, password, host, dbname) {
    this.username = username;
    this.password = password;
    this.host = host;
    this.dbname = dbname;
  }

  async getDB() {
    if (!this.db) {
      await this.createDB();
    }
    return this.db;
  }

  async createDB() {
    this.db = mongoose.createConnection(`mongodb://${this.host}/${this.dbname}`, {
      user: this.username,
      pass: this.password,
      authSource: 'admin',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    Object.keys(models).map((m) => {
      const model = models[m];
      model(mongoose, this.db);
      return m;
    });
  }
}

module.exports = DB;
