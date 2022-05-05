const Base = require('./Base');

class OmdbClient extends Base {
  constructor(apiKey, baseURL, storage, headers, timeout) {
    super(baseURL, headers, timeout);
    this.apiKey = apiKey;
    this.storage = storage;
  }

  async getMovieByTitle(title) {
    const formattedTitle = title.split(' ').join('+');
    let response;
    // applied proxy
    if (this.storage.exists(formattedTitle)) {
      response = this.storage.get(formattedTitle);
    } else {
      const params = {
        apiKey: this.apiKey,
        t: formattedTitle,
      };

      const qs = new URLSearchParams(params);
      response = await this.sendGetRequest(`/?${qs}`);
      this.storage.push(formattedTitle, response);
    }

    return response;
  }
}

module.exports = OmdbClient;
