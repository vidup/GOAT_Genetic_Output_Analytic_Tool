//This is the base of the application.
//Here you can find the header, the menu, etc...

//Dependencies
var React = require('react');
var ReactDOM = require('react-dom');
var Reflux = require('reflux');
var SnpActions = require('../reflux/SnpActions.jsx');
var SnpStore = require('../reflux/SnpStore.jsx');
var ManhattanActions = require('../reflux/ManhattanActions.jsx');
var ManhattanStore = require('../reflux/ManhattanStore.jsx');
var AreaSelectionActions = require('../reflux/AreaSelectionActions.jsx');
var AreaSelectionStore = require('../reflux/AreaSelectionStore.jsx');
//Sub Components
var HomePage = require("./HomePage.jsx");
var TablePage = require("./TablePage.jsx");
var QueryParamsPage = require('./QueryParamsPage.jsx');
var ManhattanPage = require('./ManhattanPage.jsx');
var AreaSelectionParamsPage = require('./QueryASParamsPage.jsx');
var AreaSelectionPage = require('./AreaSelectionPage.jsx');


//Test Page to try new components
var TestPage = require("./TestPage.jsx");

//Component
var Base = React.createClass({
  mixins : [
    Reflux.listenTo(SnpStore, 'onChange'),
    Reflux.listenTo(ManhattanStore, 'onChange'),
    Reflux.listenTo(AreaSelectionStore,'onChange')
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
          snps : data
        });
        break;
      case "home" :
        this.setState({
          appState : "Home",
          snps : []
        });
        break;
      case "queryParams" :
        this.setState({
          appState : "QueryParams",
          snps : []
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
          appState : "AreaSelectionForm"
        });
        break;
      case "areaSelection":
        this.setState({
          appState : "AreaSelection",
          function : data[0],
          div : data[1],
          snps : data[2]
        });
        break;
      case "test" :
        this.setState({
          appState : "Test",
          snps : []
        });
        break;
      default :
        this.setState({
          appState : "Home",
          snps : []
        });
    }
  },
  handlingState : function(){
    switch(this.state.appState){
      case "Home" :
        return <HomePage/>
        break;
      case "Table" :
        return <TablePage snps={this.state.snps}/>
        break;
      case "QueryParams":
        return <QueryParamsPage />
        break;
      case "Manhattan":
        return <ManhattanPage  function={this.state.function} div={this.state.div}/>
        break;
      case "AreaSelectionForm":
        return <AreaSelectionParamsPage/>
        break;
      case "AreaSelection":
        return <AreaSelectionPage function={this.state.function} div={this.state.div} snps={this.state.snps}/>
        break;
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
