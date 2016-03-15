var Reflux = require('reflux');
var ManhattanActions = require('./ManhattanActions.jsx');

var ManhattanStore = Reflux.createStore({
  listenables : [ManhattanActions],
  fireUpdate : function(){
    //We trigger this function when we want to refresh the data
    this.trigger('manhattan', [this.manhattanBokehFunction, this.manhattanDiv]);
  },
  getManhattanData : function(type, value){
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
