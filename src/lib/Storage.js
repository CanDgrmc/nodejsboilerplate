class Storage {
  // some quick in-app cache
  cache = {};

  push(key, val) {
    this.cache[key] = val;
  }

  get(key) {
    return this.cache[key];
  }

  exists(key) {
    return this.cache[key] !== undefined;
  }

  delete(key) {
    delete this.cache[key];
  }

  truncate() {
    this.cache = {};
  }
}

module.exports = Storage;
