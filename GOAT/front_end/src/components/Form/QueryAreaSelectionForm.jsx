//Dependencies
var React = require('react');
var AreaSelectionActions = require('../../reflux/AreaSelectionActions.jsx');
//SubComponents
var InputPosition = require('./InputPosition.jsx');
var InputChromosome = require('./InputChromosome.jsx');
var Input = require('./Input.jsx');

//Component
var QueryAreaSelectionForm = React.createClass({
  getInitialState : function(){
    return {
      type: "",
      position : "",
      chromosome: "",
      phenotype : "",
      submited : false
    }
  },
  onSubmit : function(e){
    e.preventDefault();
    this.refs.chromosome.state.valid && this.refs.phenotype.state.valid && this.refs.position.state.valid? isFormatValid = true : isFormatValid = false;

    isFormatValid? AreaSelectionActions.getAreaSelection(this.state.position, this.state.chromosome, this.state.phenotype) : alert('Your input format isn\'t valid !');
    isFormatValid? this.setState({submited : true}) : console.log("not valid");
  },
  onPositionChange : function(e){
    this.setState({ position: e.target.value});
  },
  onChromosomeChange : function(e){
    this.setState({ chromosome: e.target.value});
  },
  onPhenotypeChange : function(e){
    this.setState({ phenotype : e.target.value});
  },
  render : function(){

    var divStyle = {
      padding: "15px",
      textAlign : "center"
    }

    var centerStyle = { //To center elements
        display : "block",
        margin : "auto",
        textAlign : "center",
        fontSize : "1.5em"
    }

    var buttonStyle = {
      margin : "10px 10px"
    }
    return (
      <form role="form" style={divStyle}>
        <div className="form-group" onChange={this.onGeneChange}>
          <label style = {centerStyle}>Chromosome</label>
          <InputChromosome type="gene" ref="chromosome" placeholder="Chromosome -- Between 1 and 22"/>
        </div>
        <div className="form-group" onChange={this.onPositionChange}>
          <label style = {centerStyle}>Position</label>
          <InputPosition type="position" ref="position" placeholder="position -- format XXXXX with X between 0 and 9"/>
        </div>
        <div className="form-group" onChange={this.onPhenotypeChange}>
          <label style = {centerStyle}>Phenotype</label>
          <Input type="phenotype" ref="phenotype" placeholder="Phenotype -- Enter the phenotype you want"/>
        </div>
        <button onClick={this.onSubmit} style = {centerStyle} type="submit" className={this.state.submited? "btn btn-success" : "btn btn-primary"} id="submitAS">Area Selection</button>
      </form>
    );
  }
});

module.exports = QueryAreaSelectionForm;
