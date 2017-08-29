#!/usr/bin/env node

const gh = require('./github');
const waffle = require('./waffle');

waffle.requestJSON({
  path: '/projects',
  method: 'POST'
}, JSON.stringify({
  'name': gh.OWNER + '/' + gh.REPO
}), 201, function callback(json) {
  console.log('Waffle project created.'); // eslint-disable-line no-console

  gh.getLabels(function labelsCallback(labels) {
    var i = 1;
    var statusLabels = labels.filter(l => l.name.startsWith('Status: ')).map(l => ({
      isBacklog: false,
      isDone: false,
      displayName: l.name,
      label: l,
      rank: i++
    }));
    statusLabels.push({
      isBacklog: true,
      isDone: false,
      displayName: 'Backlog',
      rank: 0
    });
    statusLabels.push({
      isBacklog: false,
      isDone: true,
      displayName: 'Done',
      rank: i
    });

    waffle.requestJSON({
      path: `/projects/${json._id}/columns`,
      method: 'PUT'
    }, JSON.stringify(statusLabels), 200, function c() {
      console.log('Columns created.'); // eslint-disable-line no-console
    });
  });
});
