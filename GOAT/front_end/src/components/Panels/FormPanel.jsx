//Dependencies
var React = require('react');

//SubComponents
var QueryForm = require('../Form/QueryForm.jsx');

//Component
var FormPanel = React.createClass({
  render : function(){
    divStyle = {
      marginTop : "50px"
    }

    return (
      <div style={divStyle} className ="panel col-xs-12 col-md-4 col-centered">
        <QueryForm url={this.props.url} />
      </div>
    );
  }
});

module.exports = FormPanel;
