// This is the main entry point for the application
// Here we'll call for other components

//Dependencies
var React = require('react');
var ReactDOM = require('react-dom');
var Routes = require('./Routes.jsx');

//Components
var Header = require('./components/Header/Header.jsx');
var InfoPanel = require('./components/Panels/InfoPanel.jsx');
var Menu = require('./components/Menu/Menu.jsx');
var Base = require('./components/Base.jsx');

//Actual application

/* ****************************************************** Base that won't change whatever you do ************************************ */

/* ******* Header ******** */
ReactDOM.render(
  <Header title="GOAT" subtitle="Genetic Output Analysis Tool"/>,
  document.getElementById('header')
);

/* ******* Menu ********** */

var MenuItems = require('./components/ComponentsData/menuItemsList');

ReactDOM.render(
  <Menu
    items = {MenuItems}
  />,
  document.getElementById('menu')
);

/* **************************************************** This is where the real application is ***************************************** */

/* ****** Routes ****** */
ReactDOM.render(
  <Base/>, document.getElementById('application')
)
// ReactDOM.render(Routes, document.getElementById('application'));


/* ***************************************************** Little elements logic ********************************************************* */
$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    if(scroll>=135){
       $('#menuClick').css('color', function(){return "#ededed"});
    }else{
       $('#menuClick').css('color', function(){return "#333"});
    }
});
