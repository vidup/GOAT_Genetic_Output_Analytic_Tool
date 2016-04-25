/*Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.*/

// Author of the file : Victor Dupuy
// mail : victor.dupuy@hei.fr

//Dependencies
var React = require('react');
var Reflux = require('reflux');

var SnpActions = require('../../reflux/SnpActions.jsx');
var ManhattanActions = require('../../reflux/ManhattanActions.jsx');
var PhenotypeStore = require('../../reflux/PhenotypesStore.jsx');

//SubComponents
var InputSNP = require('./InputSNP.jsx');
var InputGene = require('./InputGene.jsx');
var InputPhenotype = require('./InputPhenotype.jsx');

//Component
var QueryForm = React.createClass({
  mixins : [
    Reflux.listenTo(PhenotypeStore, 'onTrigger')
  ],
  getInitialState : function(){
    return {
      type: "rsID",
      value : "",
      submited : false
    }
  },
  onTrigger : function(event, data){
      if(event=="setPhenotype"){
        this.setState({value : ""+data, type : "phenotype"});
        this.refs.phenotype.setState({value : data, valid : true});
      }
  },
  onSubmitManhattan : function(e){
    e.preventDefault();
    var isFormatValid;
    if(!this.state.submited){
      this.setState({submited : true});
      switch(this.state.type){
        case "rsID":
          this.refs.rsID.state.valid? isFormatValid = true : isFormatValid = false;
          break;
        case "gene":
          this.refs.gene.state.valid? isFormatValid = true : isFormatValid = false;
          break;
        case "phenotype":
          this.refs.phenotype.state.valid? isFormatValid = true : isFormatValid = false;
          break;
        default :
          isFormatValid = false;
      }
      isFormatValid? ManhattanActions.getManhattanData(this.state.type, this.state.value) : alert('Your input format isn\'t valid !');
    }else{
      alert('There is already a request being handled right now. Wait for a few seconds so that the application can get the data and display it');
    }
  },
  onSubmitTable : function(e){
      e.preventDefault(); // Avoid the Automatic POST request
      // SnpActions.getTableData("/table/"+this.state.type+"/"+this.state.value);
      var isFormatValid;
      if(!this.state.submited){
        this.setState({submited : true});
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
      }else{
        alert('There is already a request being handled right now. Wait for a few seconds so that the application can get the data and display it');
      }
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
          <InputPhenotype type="phenotype" ref="phenotype" placeholder="Phenotype -- Enter the name of the Phenotype" activeType ={this.state.type} value={this.state.value}/>
        </div>
        <button onClick={this.onSubmitManhattan} style = {buttonStyle} type="submit" className="btn btn-primary">Interactive Manhattan</button>
        <button onClick={this.onSubmitTable} style = {buttonStyle} type="submit" className="btn btn-primary">Table Data</button>
      </form>
    );
  }
});

module.exports = QueryForm;
