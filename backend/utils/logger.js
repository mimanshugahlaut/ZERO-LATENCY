// utils/logger.js
// Simple console logger wrapper

const log = (message, ...optionalParams) => {
  console.log(message, ...optionalParams);
};

const error = (message, ...optionalParams) => {
  console.error(message, ...optionalParams);
};

module.exports = { log, error };
