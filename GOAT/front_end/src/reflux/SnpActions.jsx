var Reflux = require('reflux');

var Actions = Reflux.createActions([
  'getTableData',
  'goHome',
  'queryParams',
  'goTest',
  'goManhattan',
  'getManhattanDiv',
  'getAreaSelection'
]);

module.exports = Actions;
