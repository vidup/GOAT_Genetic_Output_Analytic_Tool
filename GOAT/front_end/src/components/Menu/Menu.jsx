//Dependencies
var React = require('react');

//Sub Components
var MenuItem = require('./MenuItem.jsx');
var HamButton = require('../Buttons/Hambutton.jsx');

//Actual Component
var Menu = React.createClass({
  getInitialState : function(){
    return {
      visibility : "none"
    }
  },
  onButtonHover : function(){
    this.setState({visibility : "block"})
  },
  onMenuLeave : function(){
    this.setState({visibility : "none"})
  },
  render : function(){
    var divStyle = {
      backgroundColor : '#323a44',
      color : "#ededed",
      display: this.state.visibility,
  		position : "absolute",
  		left :" 0",
      listStyle : "none",
      padding : 0,
      width : 350,
      zIndex : 9999
    }

    var buttonStyle = {
      display:"inline-block",
      position : "fixed",
      left : "15px",
      top : "30px",
      fontSize : "5em",
      zIndex : "10",
      cursor : "pointer",
      color : this.state.buttonColor
    }

    var createMenuItem = function(item, index){
      return <MenuItem key={index+item.content} content={item.content} url={item.url} action={item.action}/>
    }
    return (
      <div>
        <div
          style={buttonStyle}
          onMouseOver={this.onButtonHover}
          onMouseLeave = {this.onButtonLeave}>
          <HamButton />
        </div>
        <ul
            style={divStyle}
            className="menu"
            onMouseLeave={this.onMenuLeave}>
            {this.props.items.map(createMenuItem)}
        </ul>
      </div>
    );
  }
});

module.exports = Menu;
