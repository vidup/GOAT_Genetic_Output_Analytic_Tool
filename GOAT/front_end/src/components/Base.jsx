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

//This is the base of the application.
//Here you can find the header, the menu, etc...

//Dependencies
var React = require('react');
var ReactDOM = require('react-dom');
var Reflux = require('reflux');

    //Snps for Table
    var SnpActions = require('../reflux/SnpActions.jsx');
    var SnpStore = require('../reflux/SnpStore.jsx');

    //Interactive Manhattan
    var ManhattanActions = require('../reflux/ManhattanActions.jsx');
    var ManhattanStore = require('../reflux/ManhattanStore.jsx');

    //Area Selection
    var AreaSelectionActions = require('../reflux/AreaSelectionActions.jsx');
    var AreaSelectionStore = require('../reflux/AreaSelectionStore.jsx');

    //Snps for one gene
    var SnpsForGeneActions = require('../reflux/SnpsForGeneActions.jsx');
    var SnpsForGeneStore = require('../reflux/SnpsForGeneStore.jsx');

//Sub Components
var HomePage = require("./HomePage.jsx");
var TablePage = require("./TablePage.jsx");
var QueryParamsPage = require('./QueryParamsPage.jsx');
var ManhattanPage = require('./ManhattanPage.jsx');
var AreaSelectionParamsPage = require('./QueryASParamsPage.jsx');
var AreaSelectionPage = require('./AreaSelectionPage.jsx');
var QuerySFGPage = require('./QuerySFGPage.jsx');
var SnpsForGenePage = require('./SnpsForGenePage.jsx');

//Test Page to try new components
var TestPage = require("./TestPage.jsx");

//Component
var Base = React.createClass({
  mixins : [
    Reflux.listenTo(SnpStore, 'onChange'),
    Reflux.listenTo(ManhattanStore, 'onChange'),
    Reflux.listenTo(AreaSelectionStore,'onChange'),
    Reflux.listenTo(SnpsForGeneStore, 'onChange')
  ],
  getInitialState : function(){
    return {
      appState : "Home",
      snps : []
    }
  },
  onChange : function(event, data){
    switch(event){
      case "table":
        this.setState({
          appState : "Table",
          snps : data[0],
          phenotypes : data[1]
        });
        break;
      case "home" :
        this.setState({
          appState : "Home",
          snps : [],
          phenotypes : []
        });
        break;
      case "queryParams" :
        this.setState({
          appState : "QueryParams",
          snps : [],
          phenotypes : data[0],
          message : data[1]
        });
        break;
      case "manhattan" :
        console.log(data);
        this.setState({
          appState : "Manhattan",
          snps : [],
          function : data[0],
          div : data[1]
        });
        break;
      case "areaSelectionQueryParams":
        console.log("AREA SELECTION");
        this.setState({
          appState : "AreaSelectionForm",
          phenotypes : data
        });
        break;
      case "areaSelection":
        this.setState({
          appState : "AreaSelection",
          function : data[0],
          div : data[1],
          snps : data[2],
          rsID : data[3].rsID,
          chromosome : data[3].chromosome,
          phenotype : data[3].phenotype
        });
        break;
      case "querySFGParams":
        this.setState({
          appState : "QuerySFGParams"
        });
        break;
      case "SnpForGeneData":
        this.setState({
          appState : "SnpForGeneTable",
          snps : data[0],
          phenotypes : data[1],
          gene : data[2]
        });
        break;
      case "test" :
        this.setState({
          appState : "Test",
          snps : []
        });
        break;
      default :
        console.log('');
    }
  },
  handlingState : function(){
    switch(this.state.appState){
      case "Home" :
        return <HomePage/>
        break;
      case "Table" :
        return <TablePage snps={this.state.snps} phenotypes={this.state.phenotypes}/>
        break;
      case "QueryParams":
        return <QueryParamsPage phenotypes={this.state.phenotypes} message={this.state.message}/>
        break;
      case "Manhattan":
        return <ManhattanPage  function={this.state.function} div={this.state.div}/>
        break;
      case "AreaSelectionForm":
        return <AreaSelectionParamsPage phenotypes = {this.state.phenotypes}/>
        break;
      case "AreaSelection":
        return <AreaSelectionPage function={this.state.function} div={this.state.div} snps={this.state.snps} rsID={this.state.rsID} chromosome={this.state.chromosome} phenotype={this.state.phenotype}/>
        break;
      case "QuerySFGParams":
        return <QuerySFGPage/>
      case "SnpForGeneTable":
        return <SnpsForGenePage snps={this.state.snps} phenotypes={this.state.phenotypes} gene={this.state.gene}/>
      case "Test" :
        return <TestPage/>
        break;
      default :
        return <HomePage/>
    }
  },
  render : function(){
    return (
      <div className = "row">
        {this.handlingState()}
      </div>
    );
  }
});

module.exports = Base;
