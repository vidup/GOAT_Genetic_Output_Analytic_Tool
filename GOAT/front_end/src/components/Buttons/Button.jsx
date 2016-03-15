{/*<button type="button" class="btn btn-primary">Primary</button>  // Here, put another React component for the button*/}
//Dependencies
var React = require('react');
var SnpActions = require('../../reflux/SnpActions.jsx');

var Button = React.createClass({
  getInitialState: function(){
    return {
      className : "btn btn-primary"
    }
  },
  handleClick:function() {
    this.setState({className : "btn btn-success"});
    this.props.action();
  },
  render: function(){
    var buttonStyle= {
      display : "block",
      margin : this.props.margin? this.props.margin : "auto",
      marginBottom : 15,
      marginTop : this.props.marginTop? this.props.marginTop : 0
    }
    return (<button onClick={this.handleClick} type="button" className={this.state.className} style={buttonStyle}>{this.props.text? this.props.text : "Access"}</button>);
  }
});

module.exports = Button;
