#!/usr/bin/env node

const fs = require('fs');
const waffle = require('./waffle');
const gh = require('./github');

function sortCard(sorted, i) {
  if (i >= sorted.length) {
    process.stdout.write('Done.\n');
    return;
  }

  waffle.requestJSON({
    path: `/cards/${sorted[i]._id}`,
    method: 'PUT'
  }, JSON.stringify({
    rank: 'top'
  }), 200, function callback() {
    process.stdout.write('.');
    sortCard(sorted, i + 1);
  });
}

function cardPriorities(card) {
  var cardLabels = card.githubMetadata.labels.map(l => l.name);
  return priorities
		.filter(p => cardLabels.includes(p) || p === 'size')
		.map(p => (p === 'size') ? -(card.size || 0) : priorities.indexOf(p));
}

var sortFile = 'sorting.json';
if (process.argv.length === 3) {
  sortFile = process.argv[2];
}

if (!fs.existsSync(sortFile)) {
  throw new Error(sortFile + ' does not exist.');
}

var priorities = JSON.parse(fs.readFileSync(sortFile, 'utf8'));

waffle.requestJSON({
  path: '/user/projects'
}, null, 200, function projectsCallback(projects) {
  var id = projects.filter(p => p.name === `${gh.OWNER}/${gh.REPO}`)[0]._id;
  waffle.requestJSON({
    path: `/projects/${id}/cards`
  }, null, 200, function sortCallback(cards) {
    var sorted = cards.sort(function s(a, b) {
      var la = cardPriorities(a);
      var lb = cardPriorities(b);
      if (!la.length && !lb.length) return 0;
      var i = 0;
      var ret = null;
      do {
        ret = lb[i] - la[i++];
      } while (ret === 0 && i < la.length && i < lb.length);
      return ret;
    });

    process.stdout.write('Sorting');
    sortCard(sorted, 0);
  });
});
