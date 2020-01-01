const Logger = require('../components/logger');

const logFilePath = process.env.LOG_FILE_PATH || 'request_log.log';

const logger = new Logger(logFilePath);

module.exports = async (req, res, next) => {
  const time = new Date();
  await next();
  const isError = res.statusCode !== 200;
  logger.log(`${req.url} ${time.toLocaleString('en-US', { hour12: false })} ${isError ? 'ERROR' : 'OK'}`);
};
