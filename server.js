const http = require('http');
const fs = require('fs').promises;
const HttpClient = require('./components/httpClient');

const port = process.env.PORT || 3456;
const token = process.env.IEX_API_TOKEN || 'pk_3d9df6c22bf3468fbeb516ff3c54ee59';
const apiUrl = process.env.IEX_API_URL || 'https://cloud.iexapis.com/stable';
const logFilePath = process.env.LOG_FILE_PATH || 'request_log.log';

let logFile;

async function initLogger() {
  logFile = await fs.open(logFilePath, 'a');
}

function log(value) {
  if (!logFile) return;
  logFile.write(`${value}\n`);
}

const iexClient = new HttpClient(apiUrl);

async function router(request, response) {
  const time = new Date();
  let isError = false;

  try {
    const url = new URL(request.url, 'http://localhost/');
    const [, symbol] = `${url.pathname}`.match(/^\/stock\/(.+)\//);
    if (symbol) {
      const data = await Promise.all([
        iexClient.$get(`/stock/${symbol}/quote/latestPrice?token=${token}`),
        iexClient.$get(`/stock/${symbol}/logo?token=${token}`, { json: true }),
        iexClient.$get(`/stock/${symbol}/news/last/1?token=${token}`, { json: true }),
      ]);
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ quote: data[0], logo: data[1].url, lastNew: data[2][0].url }));
    } else {
      response.writeHead(404);
      response.end('Not Found');
      isError = true;
    }
  } catch (error) {
    response.writeHead(500);
    response.end(error.message);
    isError = true;
    throw error;
  } finally {
    log(`${request.url} ${time.toLocaleString('en-US', { hour12: false })} ${isError ? 'ERROR' : 'OK'}`);
  }
}

const server = http.createServer(router);

if (require.main === module) {
  initLogger();
  server.listen(port);
  // eslint-disable-next-line no-console
  console.log('Server listening on: http://localhost:%s', port);
}

module.exports = server;
