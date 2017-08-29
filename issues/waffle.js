const https = require('https');
const process = require('process');

function getEnv(variable) {
  var value = process.env[variable];
  if (!value) {
    throw new Error('Environment variable ' + variable + ' must be set!');
  }
  return value;
}

function requestJSON(options, data, expectedStatus, callback) {
  var res = https.request(Object.assign({}, defaultOptions, options), function c(response) {
    if (expectedStatus && response.statusCode !== expectedStatus) {
      throw new Error('Waffle request failed: ' + response.statusCode);
    }

    var json = '';
    response.on('data', function fData(part) {
      json += part;
    });
    response.on('end', function fEnd() {
      if (callback) callback(JSON.parse(json));
    });
  });

  if (data) res.write(data);
  res.end();
}

var token = getEnv('WAFFLE_TOKEN');

var defaultOptions = {
  hostname: 'api.waffle.io',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'User-Agent': 'node'
  }
};

module.exports = {
  TOKEN: token,
  HTTPS_DEFAULT_OPTIONS: defaultOptions,
  getEnv: getEnv,
  requestJSON: requestJSON
};
