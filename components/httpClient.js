const http = require('http');
const https = require('https');

class HttpClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  request(url, options) {
    const parsedUrl = new URL(url, this.baseURL);
    let fetchMethod;
    switch (parsedUrl.protocol) {
      case 'http:': fetchMethod = http.request; break;
      case 'https:': fetchMethod = https.request; break;
      default: throw new Error(`unsupported protocol ${parsedUrl.protocol}`);
    }

    return new Promise((resolve, reject) => {
      fetchMethod(`${this.baseURL}${url}`, (res) => {
        const data = [];
        res.on('data', (chunk) => data.push(chunk));
        res.on('error', (error) => reject(error));

        res.on('end', () => {
          if (res.statusCode === 200) {
            res.data = options.json ? JSON.parse(data.join()) : data.join();
            resolve(res);
          } else reject(res);
        });
      }).on('error', (error) => reject(error)).end();
    });
  }

  get(url, options) {
    return this.request(url, { method: 'GET', ...options });
  }

  async $get(url, options) {
    const { data } = await this.get(url, options);
    return data;
  }
}

module.exports = HttpClient;
