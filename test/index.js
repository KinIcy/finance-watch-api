const apiTest = require('./API/api.test');
const loggerTest = require('./components/logger.test');
const httpClientTest = require('./components/httpClient.test');

async function test() {
  await loggerTest()
  await httpClientTest()
  await apiTest()
}

try {
  test();
} catch(error) {
  console.log(error.statusCode || error.message || error);
}