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
var AreaSelectionActions = require('./AreaSelectionActions.jsx');

var AreaSelectionStore = Reflux.createStore({
  listenables : [AreaSelectionActions],
  fireUpdate : function(){
    //We trigger this function when we want to refresh the data
    this.trigger('areaSelection', [
      this.script,
      this.div,
      this.data,
      {
        rsID : this.rsID,
        chromosome : this.chromosome,
        phenotype : this.phenotype
      }
    ]);
  },
  queryParams : function(){
    var store = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI("/phenotypes", true));
    xhr.onload = function(){
      if(xhr.status==200){
         store.phenotypes = JSON.parse(xhr.responseText);
         store.trigger('areaSelectionQueryParams', store.phenotypes);
      }else{
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      };
    };
    xhr.send();
  },
  getAreaSelection : function(chromosome, position, phenotype, rsID){
    // console.log(chromosome, position, phenotype);
    this.trigger('wait');
    this.rsID = rsID;
    this.chromosome = chromosome;
    this.phenotype = phenotype;
    var store = this;
    var xhr = new XMLHttpRequest();
    width = Math.floor($('#application').width()*0.9);
    height = Math.max(Math.floor($('#application').height()*0.9), 750);
    if(height>=1000){
      height = 1000;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI("/areaSelection/"+chromosome+"/"+position+"/"+phenotype+"/"+width+"/"+height), true);
    xhr.onload = function(){
      if(xhr.status==200){
         result = JSON.parse(xhr.responseText);
         store.script = result.script;
         store.div = result.div;
         store.data = JSON.parse(result.data);
         console.log('Data received :)');
         store.fireUpdate();
      }else{
        store.trigger('noData')
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      };
    };
    xhr.send();
  }
});

module.exports = AreaSelectionStore;
