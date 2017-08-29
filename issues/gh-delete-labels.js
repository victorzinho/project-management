#!/usr/bin/env node

const gh = require('./github');
const https = require('https');
const url = require('url');

function deleteLabel(label) {
  https.request(Object.assign({
    path: url.parse(label.url).path,
    method: 'DELETE'
  }, gh.HTTPS_DEFAULT_OPTIONS), function log() {
    console.log('Deleted label: ' + label.name); // eslint-disable-line no-console
  }).end();
}

gh.getLabels(l => l.forEach(deleteLabel));
