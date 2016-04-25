/*Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.*/

// Author of the file : Victor Dupuy
// mail : victor.dupuy@hei.fr

//This file contains the panel list configuration.

//Dependencies
var SnpActions = require('../../reflux/SnpActions.jsx');
var ManhattanActions = require('../../reflux/ManhattanActions.jsx');
var AreaSelectionActions = require('../../reflux/AreaSelectionActions.jsx');
var SnpsForGeneActions = require('../../reflux/SnpsForGeneActions.jsx');

//Variables
var oddClass = "col-xs-10 col-xs-offset-1 col-md-4";
var evenClass = "col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-2";
var centerClass = "col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-4"
module.exports= [
  {
    heading:"Gene Query & Manhattan",
    content : "Displays a table of snps and a list of relevant phenotypes or an interactive Manhattan plot",
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
    heading : "Snps for one Gene",
    content : "Get Relevant Snps of one Gene",
    height : "auto",
    size : centerClass,
    action : function(){
       SnpsForGeneActions.querySFGParams();
    }
  }
  // ,
  // {
  //   heading :"Machine Learning",
  //   content : "Coming soon...",
  //   height : "auto",
  //   size : evenClass
  // },{
  //   heading : "Phenotype Comparison",
  //   content : "Coming soon too",
  //   height : "auto",
  //   size : oddClass
  // }
];
