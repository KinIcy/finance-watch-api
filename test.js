const server = require('./server');
const HttpClient = require('./components/httpClient');
const assert = require('assert');

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function test() {
  const port = 3456;
  server.listen(port);
  await delay(1000)

  const client = new HttpClient(`http://localhost:${port}`);

  console.log('The Server')

  console.log('\tshould return the latest quote, logo and news of a given stock')
  await client.get('/stock/twtr/', { json: true }).then(res => {
    assert.equal(res.statusCode, 200);
    assert.notEqual(res.data.quote, undefined);
    assert.notEqual(res.data.logo, undefined);
    assert.notEqual(res.data.lastNew, undefined);
    console.log('OK')
  })

  console.log('\tshould return 404 when a unknown stock ticket is used')
  await client.get('/stock/t0tr').catch((res) => {
    assert.equal(res.statusCode, 404)
    console.log('OK')
  })

  server.close();
}

try {
  test();
} catch(error) {
  console.error(error.message || error.statusCode)
}