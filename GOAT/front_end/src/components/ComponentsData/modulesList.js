//This file contains the panel list configuration.

//Dependencies
var SnpActions = require('../../reflux/SnpActions.jsx');

module.exports= [
  {
    heading:"Gene Query",
    content : "Displays a table of snps and a list of relevant phenotypes",
    height : "auto",
    size : "col-xs-10 col-xs-offset-1 col-md-4",
    url : "/table", //Testing Url.
    action : function(){
      SnpActions.queryParams();
    }
  },
  {
    heading :"Area Selection",
    content : "Requires a position, and displays a zoomed-in, interactive Manhattan plot",
    height : "auto",
    size : "col-xs-10 col-xs-offset-2 col-md-4"
  },
  {
    heading :"Manhattan",
    content : "Displays a Manhattan plot for a selected treshold",
    caution : "Takes a long time to run (5min)",
    height : "auto",
    size : "col-xs-10 col-xs-offset-1 col-md-4",
    action : function(){
      SnpActions.goManhattan();
    }
  },
  {
    heading :"Machine Learning",
    content : "Coming soon...",
    height : "auto",
    size : "col-xs-10 col-xs-offset-2 col-md-4"
  }
];
