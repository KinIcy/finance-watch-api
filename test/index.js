const apiTest = require('./API/api.test');
const loggerTest = require('./components/logger.test');

async function test() {
  await loggerTest()
  await apiTest()
}

try {
  test();
} catch(error) {
  console.log(error.statusCode || error.message || error);
}