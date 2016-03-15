var Reflux = require('reflux');
var SnpActions = require('./SnpActions.jsx');

var SnpStore = Reflux.createStore({
  listenables : [SnpActions],
  fireUpdate : function(){
    //We trigger this function when we want to refresh the data
    this.trigger('table', this.snps);
  },
  getTableData : function(url){
    var store = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(url), true);
    xhr.onload = function(){
      if(xhr.status==200){
          console.log('data received');
        //  console.log(JSON.parse(xhr.responseText));
          store.snps = JSON.parse(xhr.responseText);
          console.log(store.snps);
          store.fireUpdate();
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
  queryParams : function(url){
    this.trigger('queryParams', "Form to set query parameters !")
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
