const http = require('http');
const https = require('https');
const fs = require('fs').promises;

const port = process.env.PORT || 3456;
const token = process.env.IEX_API_TOKEN || 'pk_3d9df6c22bf3468fbeb516ff3c54ee59';
const apiUrl = process.env.IEX_API_URL || 'https://cloud.iexapis.com/stable';
const logFilePath = process.env.LOG_FILE_PATH || 'request_log.log';

function httpClient(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(data.join(), res));
      res.on('error', (error) => reject(error));
    }).on('error', (error) => reject(error));
  });
}

let logFile;

async function initLogger() {
  logFile = await fs.open(logFilePath, 'a');
}

function log(value) {
  if (!logFile) return;
  logFile.write(`${value}\n`);
}

async function router(request, response) {
  const time = new Date();
  let isError = false;

  try {
    const url = new URL(request.url, 'http://localhost/');
    const [, symbol] = `${url.pathname}`.match(/^\/stock\/(.+)\//);
    if (symbol) {
      const quote = await httpClient(`${apiUrl}/stock/${symbol}/quote/latestPrice?token=${token}`);
      const { url: logo } = JSON.parse(await httpClient(`${apiUrl}/stock/${symbol}/logo?token=${token}`));
      const [lastNew] = JSON.parse(await httpClient(`${apiUrl}/stock/${symbol}/news/last/1?token=${token}`));
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ quote, logo, lastNew: lastNew.url }));
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
