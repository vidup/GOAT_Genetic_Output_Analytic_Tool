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
      marginBottom : 15
    }
    return (<button onClick={this.handleClick} type="button" className={this.state.className} style={buttonStyle}>Access</button>);
  }
});

module.exports = Button;
