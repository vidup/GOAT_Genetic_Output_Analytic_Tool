/*
 *
App.js
Author : Victor DUPUY
 *
 */


//Function to render the response in HTML

var tableDisplay = function(data){
    // table data array
    var tableArray = [];
    var rowString = ""; // We'll use it to build a row, then push it into the tableArray, then wipe it, and repeat the process.
    // table header
    rowString = "<thead><tr>";
    for(var i in data[0]){
        rowString+="<td>"+i+"</td>"
    }
    rowString+="</tr></thead>";
    tableArray.push(rowString); // We push into the array
    rowString = ""; // We destroy rowString's content

    // table content
    tableArray.push("<tbody>");
    for(i in data){
        rowString = "<tr>";
        for(var key in data[i]){
            rowString+="<td>"+data[i][key]+"</td>";
        }
        rowString+="</tr>";
        tableArray.push(rowString); // We add the row
    }
    tableArray.push("</tbody>");
    //document.getElementById('gallery').innerHTML = tableArray.join(' ');

}


var button = document.getElementById('table');

button.addEventListener('click', function(e){
    e.preventDefault();
    xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI('/table'));
    xhr.onload = function(){
      if(xhr.status==200){
          console.log('data received');
        tableDisplay(JSON.parse(xhr.responseText));
      }else{
        console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
      }
    };
    xhr.send();
});