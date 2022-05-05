class Base {
  constructor({
    repositories,
    clients,
    logger,
    config,
  }) {
    this.repositories = repositories;
    this.clients = clients;
    this.logger = logger;
    this.config = config;
  }
}

module.exports = Base;
