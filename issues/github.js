const process = require('process');
const https = require('https');

function getEnv(variable) {
  var value = process.env[variable];
  if (!value) {
    throw new Error('Environment variable ' + variable + ' must be set!');
  }
  return value;
}

var owner = getEnv('GITHUB_OWNER');
var repo = getEnv('GITHUB_REPO');
var token = getEnv('GITHUB_TOKEN');
var ghBasePath = `/repos/${owner}/${repo}`;
var ghDefaultOptions = {
  hostname: 'api.github.com',
  headers: {
    'Authorization': `token ${token}`,
    'User-Agent': 'node script'
  }
};
function getGitHubLabels(callback) {
  var options = Object.assign({
    path: ghBasePath + '/labels'
  }, ghDefaultOptions);
  https.get(options, function c(res) {
    var json = '';
    res.on('data', function data(part) {
      json += part;
    });
    res.on('end', function end() {
      callback(JSON.parse(json));
    });
  });
}

module.exports = {
  OWNER: owner,
  REPO: repo,
  TOKEN: token,
  HTTPS_DEFAULT_OPTIONS: ghDefaultOptions,
  HTTPS_BASE_PATH: ghBasePath,
  getEnv: getEnv,
  getLabels: getGitHubLabels
};
