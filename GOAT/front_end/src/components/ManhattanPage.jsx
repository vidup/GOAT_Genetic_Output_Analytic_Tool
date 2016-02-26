//Dependencies
var React = require('react');
var ReactDOM = require('react-dom');

//Sub-Components

//Component
var ManhattanPage = React.createClass({
  componentDidMount : function(){
    eval(this.props.function);
  },
  render : function(){
    var titleStyle = {
      textAlign : "center",
      color : "#ededed"
    }

    return(
      <div
        id={$.parseXML(this.props.div).firstChild.id}
        className = {$.parseXML(this.props.div).firstChild.className}
        >
        <h1 style={titleStyle}>ManhattanPage</h1>
      </div>
    )
  }
});

module.exports= ManhattanPage;
