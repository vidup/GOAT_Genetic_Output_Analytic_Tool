var Reflux = require('reflux');
var AreaSelectionActions = require('./AreaSelectionActions.jsx');

var AreaSelectionStore = Reflux.createStore({
  listenables : [AreaSelectionActions],
  fireUpdate : function(){
    //We trigger this function when we want to refresh the data
    this.trigger('areaSelection', [this.script, this.div, this.data]);
  },
  queryParams : function(){
    this.trigger('areaSelectionQueryParams', 'Displays the Area Selection input form');
  },
  getAreaSelection : function(){
    var store = this;
    var xhr = new XMLHttpRequest();
    width = Math.floor($('#application').width()*0.9);
    height = Math.max(Math.floor($('#application').height()*0.9), 750);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI("/areaSelection/1/5000000/All cause death/"+width+"/"+height), true);
    xhr.onload = function(){
      if(xhr.status==200){
         result = JSON.parse(xhr.responseText);
         store.script = result.script;
         store.div = result.div;
         store.data = JSON.parse(result.data);
         console.log('Data received :)');
         store.fireUpdate();
      }else{
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      };
    };
    xhr.send();
  }
});

module.exports = AreaSelectionStore;
