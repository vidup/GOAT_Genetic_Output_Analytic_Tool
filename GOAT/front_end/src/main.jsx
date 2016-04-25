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
