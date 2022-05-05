class Configuration {
  config = {};

  constructor(configs) {
    this.config = configs;
  }

  get(key) {
    if (!this.config[key]) {
      throw new Error(`config ${key} not found`);
    }
    return this.config[key];
  }

  set(key, val) {
    this.config[key] = val;
  }
}

module.exports = Configuration;
