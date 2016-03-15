//Dependencies
var React = require('react');

//Sub Components
var Table = require('./Tables/Table.jsx');

//Component
var TablePage = React.createClass({
  render : function(){
    var titleStyle = {
      textAlign : "center",
      color : "#ededed"
    }

    return (
      <div>
        <h1 style={titleStyle}>Gene Query</h1>
        <Table snps = {this.props.snps}/>
      </div>
    );
  }
});

module.exports = TablePage;
