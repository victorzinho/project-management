#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const process = require('process');
const gh = require('./github');

const HTTPS_OPTIONS = Object.assign({}, {
  path: `${gh.HTTPS_BASE_PATH}/labels`,
  method: 'POST'
}, gh.HTTPS_DEFAULT_OPTIONS);

function create(name, color) {
  var req = https.request(HTTPS_OPTIONS, r => console.log(`Creating label ${name}...${r.statusCode}`)); // eslint-disable-line no-console
  req.write(JSON.stringify({
    name: name,
    color: color
  }));
  req.end();
}

var labelsFile = 'labels.json';
if (process.argv.length === 3) {
  labelsFile = process.argv[2];
}

if (!fs.existsSync(labelsFile)) {
  throw new Error(labelsFile + ' does not exist.');
}

var labels = JSON.parse(fs.readFileSync(labelsFile, 'utf8'));
for (var name in labels) { // eslint-disable-line guard-for-in
  var color = labels[name];
  if (typeof color !== 'string' || color.trim().length === 0) continue;
  create(name, color);
}
