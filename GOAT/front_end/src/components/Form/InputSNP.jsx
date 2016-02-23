//Dependencies
var React = require('react');
var validator = require('node-validator');

//Component
var InputSNP = React.createClass({
  getInitialState: function(){
    return {
      value : "",
      class : "form-control",
      backgroundColor : "#fff"
    }
  },
  onChange : function(e){
    this.setState({value : e.target.value}); // We save the input value in the state.value attribute
    console.log("Change !");
    var regex = new RegExp("^rs+([0-9]+$)") // Our regex to check the rsID format
    //Check if in "rsxxxxxxx" form with each x being a number between 0 and 9, at that there is at least one x
    e.target.value.search(regex)==-1?
      this.setState({value:e.target.value, valid:false, backgroundColor : "#f2dede"}) :
      this.setState({value:e.target.value, valid:true, backgroundColor:"#dff0d8"});
  },
  render : function(){
    var inputStyle={
      display : "block",
      width : "80%",
      height : "40px",
      margin : "auto",
      backgroundColor : this.props.type==this.props.activeType? this.state.backgroundColor : "#fff"
    }
// {/*value={this.props.activeType==this.props.type? this.state.value : "" }*/}
    return (
      <div>
        <input
          onChange={this.onChange}
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.activeType==this.props.type? this.state.value : "" }
          className={this.state.class}
          style={inputStyle}
        />
      </div>
    );
  }
});

module.exports = InputSNP;
