//This file contains the panel list configuration.

//Dependencies
var SnpActions = require('../../reflux/SnpActions.jsx');
var ManhattanActions = require('../../reflux/ManhattanActions.jsx');
var AreaSelectionActions = require('../../reflux/AreaSelectionActions.jsx');

//Variables
var oddClass = "col-xs-10 col-xs-offset-1 col-md-4";
var evenClass = "col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-2";
module.exports= [
  {
    heading:"Gene Query & Manhattan",
    content : "Displays a table of snps and a list of relevant phenotypes",
    height : "auto",
    size : oddClass,
    url : "/table", //Testing Url.
    action : function(){
      SnpActions.queryParams();
    }
  },
  {
    heading :"Area Selection",
    content : "Requires a position, and displays a zoomed-in, interactive Manhattan plot",
    height : "auto",
    size : evenClass,
    action : function(){
      AreaSelectionActions.queryParams();
    }
  },
  // {
  //   heading :"Manhattan",
  //   content : "Displays a Manhattan plot for a selected treshold",
  //   caution : "Takes a long time to run (5min)",
  //   height : "auto",
  //   size : "col-xs-10 col-xs-offset-1 col-md-4",
  //   action : function(){
  //     ManhattanActions.getManhattanData();
  //   }
  // },
  {
    heading :"Machine Learning",
    content : "Coming soon...",
    height : "auto",
    size : oddClass
  },{
    heading : "Phenotype Comparison",
    content : "Coming soon too",
    height : "auto",
    size : evenClass
  }
];
