var logger = require('winston');

logger.add(logger.transports.File, { filename: "./logs/bot.log", level: "silly" });
logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, { colorize: true, level: "silly" })
logger.info('Chill Winston, the logs are being captured 2 ways- console, and file');
module.exports = logger;