//This is the application Router

//Dependencies
var React = require('react');
var ReactRouter= require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

//Page Components
var Base = require('./components/Base.jsx');
var HomePage = require('./components/HomePage.jsx');
var TablePage = require('./components/TablePage.jsx');

var Routes = (
  <Router>
    <Route path="/" component = {Base}>
      <Route path="/home" component={HomePage}/>
      <Route path="/table" component={TablePage}/>
    </Route>
  </Router>
);

module.exports = Routes;
