//Dependencies
var React = require('react');
var SnpActions = require('../../reflux/SnpActions.jsx');
var ManhattanActions = require('../../reflux/ManhattanActions.jsx');
//SubComponents
var InputSNP = require('./InputSNP.jsx');
var InputGene = require('./InputGene.jsx');
var InputPhenotype = require('./InputPhenotype.jsx');

//Component
var QueryForm = React.createClass({
  getInitialState : function(){
    return {
      type: "rsID",
      value : ""
    }
  },
  onSubmitManhattan : function(e){
    e.preventDefault();
    var isFormatValid;
    switch(this.state.type){
      case "rsID" :
        this.refs.rsID.state.valid? isFormatValid = true : isFormatValid = false;
        break;
      case "gene" :
        this.refs.gene.state.valid? isFormatValid = true : isFormatValid = false;
        break;
      case "phenotype":
        this.refs.phenotype.state.valid? isFormatValid = true : isFormatValid = false;
        break;
      default :
        isFormatValid = false;
    }
    isFormatValid? ManhattanActions.getManhattanData(this.state.type, this.state.value) : alert('Your input format isn\'t valid !');
  },
  onSubmitTable : function(e){
      e.preventDefault(); // Avoid the Automatic POST request
      // SnpActions.getTableData("/table/"+this.state.type+"/"+this.state.value);
      var isFormatValid;
      switch(this.state.type){
        case "rsID" :
          this.refs.rsID.state.valid? isFormatValid = true : isFormatValid = false;
          break;
        case "gene" :
          this.refs.gene.state.valid? isFormatValid = true : isFormatValid = false;
          break;
        case "phenotype":
          this.refs.phenotype.state.valid? isFormatValid = true : isFormatValid = false;
          break;
        default :
          isFormatValid = false;
      }
      isFormatValid? SnpActions.getTableData("/table/"+this.state.type+"/"+this.state.value) : alert('Your input format isn\'t valid !');

  },
  onRsIDChange : function(e){
    this.setState({ value: e.target.value, type : "rsID"});
  },
  onGeneChange : function(e){
    this.setState({ value: e.target.value, type: "gene"});
  },
  onPhenotypeChange : function(e){
    this.setState({ value: e.target.value, type:"phenotype" });
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
        <div className="form-group" onChange={this.onRsIDChange}>
          <label style = {centerStyle}>rsID</label>
          <InputSNP type="rsID" ref="rsID" placeholder="rsID -- format rsXXXXX with X between 0 and 9" activeType ={this.state.type} />
        </div>
        <div className="form-group" onChange={this.onGeneChange}>
          <label style = {centerStyle}>Gene</label>
          <InputGene type="gene" ref="gene" placeholder="Gene -- Enter the name of the Gene" activeType ={this.state.type} />
        </div>
        <div className="form-group" onChange={this.onPhenotypeChange}>
          <label style = {centerStyle}>Phenotype</label>
          <InputPhenotype type="phenotype" ref="phenotype" placeholder="Phenotype -- Enter the name of the Phenotype" activeType ={this.state.type} />
        </div>
        <button onClick={this.onSubmitManhattan} style = {buttonStyle} type="submit" className="btn btn-primary">Interactive Manhattan</button>
        <button onClick={this.onSubmitTable} style = {buttonStyle} type="submit" className="btn btn-primary">Table Data</button>
      </form>
    );
  }
});

module.exports = QueryForm;
