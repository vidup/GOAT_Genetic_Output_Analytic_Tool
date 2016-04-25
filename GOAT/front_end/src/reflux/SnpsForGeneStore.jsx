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

var Reflux = require('reflux');
var SnpsForGeneActions = require('./SnpsForGeneActions.jsx');

var SnpForGeneStore = Reflux.createStore({
  listenables : [SnpsForGeneActions],
  fireUpdate : function(action){
    //We trigger this function when we want to refresh the data
    switch(action){
      case "querySFGParams":
        this.trigger("querySFGParams");
        break;
      case "data":
        this.trigger("SnpForGeneData", [this.snps, this.phenotypes, this.gene]);
        break;
      case "noData":
        this.trigger("noData");
        break;
      case "wait":
        this.trigger("wait");
        break;
      default:
        console.log("Default");
    }
  },
  querySFGParams : function(){
    this.fireUpdate('querySFGParams');
  },
  getData : function(gene){
    this.fireUpdate('wait');
    this.gene = gene;
    var store = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI("/snpsForGene/"+gene, true));
    xhr.onload = function(){
      if(xhr.status==200){
        if(JSON.parse(xhr.responseText).noResult){
          store.fireUpdate('noData')
        }else{
          store.snps = JSON.parse(JSON.parse(xhr.responseText).data);
          store.phenotypes = JSON.parse(JSON.parse(xhr.responseText).phenotypes);
          store.fireUpdate('data');
        }
      }else{
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      };
    };
    xhr.send();
  }
});

module.exports = SnpForGeneStore;
