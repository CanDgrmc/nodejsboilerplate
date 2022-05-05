const axios = require('axios');

module.exports = class {
  constructor(baseURL, headers = {}, timeout = 1000) {
    this.cli = axios.create({
      baseURL,
      timeout,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  async sendGetRequest(endpoint) {
    const response = await this.cli.get(endpoint);
    return response.data;
  }
};
