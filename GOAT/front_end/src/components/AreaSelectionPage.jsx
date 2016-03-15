//Dependencies
var React = require('react');
var ReactDOM = require('react-dom');
var ASTable = require('./Tables/ASTable.jsx');

//Sub-Components

//Component
var AreaselectionPage = React.createClass({
  componentDidMount : function(){
    eval(this.props.function.substring(32,result.script.length-9));
  },
  render : function(){
    var titleStyle = {
      textAlign : "center",
      color : "#ededed"
    }

    return(
      <div>
        <div
          id={$.parseXML(this.props.div).firstChild.id}
          className = {$.parseXML(this.props.div).firstChild.className}
          >
        </div>
        <ASTable snps={this.props.snps}/>
      </div>
    )
  }
});

module.exports= AreaselectionPage;
