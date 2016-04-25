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

//This file contains the side-menu configuration.

//Dependencies
var SnpActions = require('../../reflux/SnpActions.jsx');
var AreaSelectionActions = require('../../reflux/AreaSelectionActions.jsx');
var SnpsForGeneActions = require('../../reflux/SnpsForGeneActions.jsx');

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
      AreaSelectionActions.queryParams();
    }
  },
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
