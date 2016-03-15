//Dependencies
var React = require('react');

//SubComponents
var QueryAreaSelectionForm = require('./Form/QueryAreaSelectionForm.jsx');

//Component
var QueryASParamsPage = React.createClass({
  render : function(){
    divStyle = {
      marginTop : "50px"
    }

    return (
      <div style={divStyle} className ="panel col-xs-12 col-md-4 col-centered">
        <QueryAreaSelectionForm />
      </div>
    );
  }
});

module.exports = QueryASParamsPage;
