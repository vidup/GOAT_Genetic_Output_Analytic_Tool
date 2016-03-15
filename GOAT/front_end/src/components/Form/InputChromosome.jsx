//Dependencies
var React = require('react');
var validator = require('node-validator');

//Component
var InputChromosome = React.createClass({
  getInitialState: function(){
    return {
      value : "",
      class : "form-control",
      backgroundColor : "#fff"
    }
  },
  onChange : function(e){
    this.setState({value : e.target.value});
    var regex = new RegExp("0[1-9]|1[0-9]|2[0-2]|[1-9]") // Our regex to check the chromosome format
    //Check if the input value is a number between 01 (or 1) and 22 (23 not used)
    console.log(e.target.value.search(regex));
    e.target.value.search(regex)==-1?
      this.setState({value:e.target.value, valid:false, backgroundColor : "#f2dede"}) :
      this.setState({value:e.target.value, valid:true,  backgroundColor:"#dff0d8"});
  },
  render : function(){

    var inputStyle={
      display : "block",
      width : "80%",
      height : "40px",
      margin : "auto",
      backgroundColor : this.state.backgroundColor
    }

    return (
      <div>
        <input
          onChange={this.onChange}
          type="text"
          placeholder={this.props.placeholder}
          value={this.state.value}
          className={this.state.class}
          style={inputStyle}
        />
      </div>
    );
  }
});

module.exports = InputChromosome;
