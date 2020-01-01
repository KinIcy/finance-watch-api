const http = require('http');
const HttpClient = require('./components/httpClient');
const Router = require('./components/router');

const logger = require('./middleware/logger');

const port = process.env.PORT || 3456;
const token = process.env.IEX_API_TOKEN || 'pk_3d9df6c22bf3468fbeb516ff3c54ee59';
const apiUrl = process.env.IEX_API_URL || 'https://cloud.iexapis.com/stable';
const iexClient = new HttpClient(apiUrl);
const router = new Router();

router.use(logger);

router.get(/^\/stock\/(.+)\//, async (req, res) => {
  const [, symbol] = req.match;
  try {
    if (symbol) {
      const data = await Promise.all([
        iexClient.$get(`/stock/${symbol}/quote/latestPrice?token=${token}`),
        iexClient.$get(`/stock/${symbol}/logo?token=${token}`, { json: true }),
        iexClient.$get(`/stock/${symbol}/news/last/1?token=${token}`, { json: true }),
      ]);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        quote: data[0],
        logo: data[1].url,
        lastNew: data[2][0].url,
      }));
    }
  } catch (error) {
    if (error.statusCode === 404) {
      res.writeHead(404);
      res.end('unknown stock symbol');
    } else {
      res.writeHead(500);
      res.end(error.message);
      throw error;
    }
  }
});

const server = http.createServer(router.handle());

if (require.main === module) {
  server.listen(port);
  // eslint-disable-next-line no-console
  console.log('Server listening on: http://localhost:%s', port);
}

module.exports = server;
