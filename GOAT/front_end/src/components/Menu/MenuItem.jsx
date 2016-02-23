//Dependencies
var React = require('react');
var SnpActions = require('../../reflux/SnpActions.jsx');

//Component
var MenuItem = React.createClass({
  handleClick : function(){
    this.props.action? this.props.action() : console.log("No action"); //Calls a function that has the same name as the action received in props (if it exists).
  },
  render : function(){
    var divStyle = {
      textAlign : "left"
    }
    return (
      <li style={divStyle}>
        <h2 onClick={this.handleClick}> {this.props.content}</h2>
      </li>
    );
  }
});

module.exports = MenuItem;
