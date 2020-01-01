const Logger = require('../../components/logger');
const { delay } = require('../utils');
const fs = require('fs').promises;
const assert = require('assert');

const logFilePath = 'test.log'

async function test() {
  const logger = new Logger(logFilePath)
  await delay(1000);

  console.log('The Logger')
  
  console.log('\t should log a string to a log file')
  await logger.log('Hello World').then(async () => {
    await logger.close()
    const buffer = await fs.readFile(logFilePath)
    assert(buffer.toString(), 'Hello World');
    console.log('OK')
  })
  
  await fs.truncate(logFilePath);
}

module.exports = test;