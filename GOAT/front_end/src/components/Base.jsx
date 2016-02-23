//This is the base of the application.
//Here you can find the header, the menu, etc...

//Dependencies
var React = require('react');
var ReactDOM = require('react-dom');
var Reflux = require('reflux');
var SnpActions = require('../reflux/SnpActions.jsx');
var SnpStore = require('../reflux/SnpStore.jsx');

//Sub Components
var HomePage = require("./HomePage.jsx");
var TablePage = require("./TablePage.jsx");
var QueryParamsPage = require('./QueryParamsPage.jsx');

//Test Page to try new components
var TestPage = require("./TestPage.jsx");

//Component
var Base = React.createClass({
  mixins : [Reflux.listenTo(SnpStore, 'onChange')],
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
