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

var SnpsForGeneActions = require('../../reflux/SnpsForGeneActions.jsx');
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
      value : "",
      submited : false
    }
  },
  onSubmit : function(e){
    e.preventDefault();
    if(!this.state.submited){
      this.setState({
        submited : true
      }, function(){
        SnpsForGeneActions.getData(this.state.value);
      });
    }else{
      alert('There is already a request being handled right now. Please wait');
    }
  },
  onChange : function(e){
    this.setState({ value: e.target.value});
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
        <div className="form-group" onChange={this.onChange}>
          <label style = {centerStyle}>Gene</label>
          <InputGene type="gene" ref="gene" placeholder="Gene -- Enter the name of the Gene" activeType ="gene" />
        </div>
        <button onClick={this.onSubmit} style={buttonStyle} type="submit" className="btn btn-primary">Get SNPs</button>
      </form>
    );
  }
});

module.exports = QueryForm;
