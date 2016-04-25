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
var ManhattanActions = require('./ManhattanActions.jsx');

var ManhattanStore = Reflux.createStore({
  listenables : [ManhattanActions],
  fireUpdate : function(){
    //We trigger this function when we want to refresh the data
    this.trigger('manhattan', [this.manhattanBokehFunction, this.manhattanDiv]);
  },
  getManhattanData : function(type, value){
    this.trigger('wait');

    var store = this;
    var xhr = new XMLHttpRequest();
    width = Math.floor($('#application').width()*0.9);
    height = Math.max(Math.floor($('#application').height()*0.9), 750);
    xhr.open('GET', encodeURI("/manhattan/"+type+"/"+value+"/"+width+"/"+height), true);
    xhr.onload = function(){
      if(xhr.status==200){
         var response = xhr.responseText.slice(32,-9); // Remove the first 31 characters (<script text="type/javascript">) and the last 8 characters (</script>)
         store.manhattanBokehFunction = response;
         store.getManhattanDiv();
      }else{
        store.trigger('noPhenotype')
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      };
    };
    xhr.send();
  },
  getManhattanDiv : function(){
    var store = this;
    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', encodeURI('/div'));
    xhr2.onload = function(){
       if(xhr2.status==200){
          var div = xhr2.responseText;
          store.manhattanDiv = div;
          // console.log(div);
          // $('#application').append(div);
          // eval(response);
          store.fireUpdate();
       }else{
          console.log('GOAT here : we couldn\'t get your div');
       }
    }
    xhr2.send();
  }
});

module.exports = ManhattanStore;
