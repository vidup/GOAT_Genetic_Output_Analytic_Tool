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

var AreaSelectionActions = require('../../reflux/AreaSelectionActions.jsx');
var AreaSelectionStore = require('../../reflux/AreaSelectionStore.jsx');
var PhenotypeStore = require('../../reflux/PhenotypesStore.jsx');

//SubComponents
var InputPosition = require('./InputPosition.jsx');
var InputChromosome = require('./InputChromosome.jsx');
var Input = require('./Input.jsx');

//Component
var QueryAreaSelectionForm = React.createClass({
  mixins : [
    Reflux.listenTo(PhenotypeStore, 'onTrigger'),
    Reflux.listenTo(AreaSelectionStore, 'onChange')
  ],
  onChange : function(event, data){
    switch(event){
      case 'noData':
        this.setState({message : 'No Data for these params !'});
        break;
      case 'wait':
        this.setState({message : 'Querying data right now...'});
        break;
      default:
        console.log('nothing');
    }
  },
  getInitialState : function(){
    return {
      type: "",
      position : "",
      chromosome: "",
      phenotype : "",
      submited : false,
      message : 'Choose your params'
    }
  },
  onTrigger : function(event, data){
    if(event=="setPhenotype"){
      this.setState({phenotype : data});
      this.refs.phenotype.setState({value : data, valid : true});
    }
  },
  onSubmit : function(e){
    e.preventDefault();
    this.refs.chromosome.state.valid && this.refs.phenotype.state.valid && this.refs.position.state.valid? isFormatValid = true : isFormatValid = false;
    isFormatValid? AreaSelectionActions.getAreaSelection(this.state.chromosome, this.state.position, this.state.phenotype) : alert('Your input format isn\'t valid !');
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
      <div className = "panel col-xs-12 col-md-4 col-centered">
      <h2 style={{textAlign : "center"}}>{this.state.message}</h2>
      <form role="form" style={divStyle}>
        <div className="form-group" onChange={this.onChromosomeChange}>
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
      </div>

    );
  }
});

module.exports = QueryAreaSelectionForm;
