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
var SnpActions = require('./SnpActions.jsx');

var SnpStore = Reflux.createStore({
  listenables : [SnpActions],
  fireUpdate : function(action){
    //We trigger this function when we want to refresh the data
    this.trigger(action, [this.snps, this.phenotypes]);
  },
  getTableData : function(url){
    var store = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(url), true);
    store.trigger('wait');
    xhr.onload = function(){
      if(xhr.status==200){
        result = JSON.parse(xhr.responseText);
        if(!result.noResult){
          store.snps = JSON.parse(result.data);
          store.phenotypes = [];
          for(phenotype of JSON.parse(result.phenotypes)){
            store.phenotypes.push(phenotype.nom);
          }
          store.phenotypes = JSON.parse(result.phenotypes);
          store.fireUpdate('table');
        }else{
          console.log('Error');
          store.fireUpdate('noPhenotype');
        }
      }else{
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      };
    };
    xhr.send();
  },
  goHome : function(url){
    this.trigger('home', "HOME !!!!")
  },
  goTest : function(url){
    this.trigger('test', "Go TEST")
  },
  queryParams : function(message){
    // console.log(chromosome, position, phenotype);
    var store = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI("/phenotypes", true));
    xhr.onload = function(){
      if(xhr.status==200){
         store.phenotypes = JSON.parse(xhr.responseText);
         store.trigger('queryParams', [store.phenotypes, message]);
      }else{
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      };
    };
    xhr.send();
  },
  goManhattan : function(){
    this.trigger('goManhattan', "Manhattan Page !")
  },
  getManhattanDiv : function(){
    var xhr = new XMLHttpRequest();
    width = Math.floor($('body').width()*0.9);
    height = Math.floor($('body').height()*0.9);
    xhr.open('GET', encodeURI("/manhattan/"+width+"/"+height), true);
    xhr.onload = function(){
      if(xhr.status==200){
         var response = xhr.responseText.slice(32,-9); // Remove the first 31 characters (<script text="type/javascript">) and the last 8 characters (</script>)
         var xhr2 = new XMLHttpRequest();
         xhr2.open('GET', encodeURI('/div'));
         xhr2.onload = function(){
            if(xhr2.status==200){
               var div = xhr2.responseText;
               console.log(div);
               $('#application').append(div);
               eval(response);
            }else{
               console.log('GOAT here : we couldn\'t get your div');
            }
         }
         xhr2.send();
      }else{
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      };
    };
    xhr.send();
    this.trigger('getManhattanDiv', 'Get Manhattan Div')
  },
  getAreaSelection : function(){
    console.log('Get AreaSelection')
  }
});

module.exports = SnpStore;


// var xhr = new XMLHttpRequest();
// width = Math.floor($('body').width()*0.9);
// height = Math.floor($('body').height()*0.9);
// xhr.open('GET', encodeURI("/manhattan/"+width+"/"+height), true);
//     xhr.onload = function(){
//       if(xhr.status==200){
//          var response = xhr.responseText.slice(32,-9); // Remove the first 31 characters (<script text="type/javascript">) and the last 8 characters (</script>)
//          var xhr2 = new XMLHttpRequest();
//          xhr2.open('GET', encodeURI('/div'));
//              xhr2.onload = function(){
//                 if(xhr2.status==200){
//                    var div = xhr2.responseText;
//                    console.log(div);
//                    $('#application').append(div);
//                    eval(response);
//                 }else{
//                    console.log('GOAT here : we couldn\'t get your div');
//                 }
//              }
//              xhr2.send();
//       }else{
//         console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
//       };
//     };
//     xhr.send();
