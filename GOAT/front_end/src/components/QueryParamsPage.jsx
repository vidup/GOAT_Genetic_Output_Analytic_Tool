//Dependencies
var React = require('react');
var SnpActions = require('../reflux/SnpActions.jsx');

//Sub Components
var FormPanel = require('./Panels/FormPanel.jsx');

//Component
var QueryParamsPage = React.createClass({
  render : function(){
    return (
      <div >
          <FormPanel />
      </div>
    );
  }
});

module.exports = QueryParamsPage;
