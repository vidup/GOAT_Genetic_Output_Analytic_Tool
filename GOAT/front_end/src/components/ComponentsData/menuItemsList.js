//This file contains the side-menu configuration.

//Dependencies
var SnpActions = require('../../reflux/SnpActions.jsx');

module.exports = [
  {
    content : "HOME",
    url : '/home',
    action : function(){
      SnpActions.goHome();
    }
  },
  {
    content : "GENE QUERY",
    url : '/geneQuery',
    action : function(){
      SnpActions.queryParams();
    }
  },
  {
    content : "AREA SELECTION",
    url : '/areaSelection',
    action : function(){
      SnpActions.getAreaSelection();
    }
  },
  // {
  //   content : "MANHATTAN",
  //   url : '/manhattan',
  //   action : function(){
  //     SnpActions.getManhattanDiv();
  //   }
  // },
  {
    content : "MACHINE LEARNING",
    url : '/machineLearning'
  },
  {
    content : "TEST",
    url : '/test',
    action : function(){
      SnpActions.goTest();
    }
  }
];
