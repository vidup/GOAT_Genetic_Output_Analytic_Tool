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
var validator = require('node-validator');

//Component
var InputGene = React.createClass({
  getInitialState: function(){
    return {
      value : "",
      class : "form-control",
      backgroundColor : "#fff",
      autoCompleteData : []
    }
  },
  onChange : function(e){
    var regex = new RegExp("[a-zA-Z0-9]*") // Our regex to check the rsID format
    //Check if in "rsxxxxxxx" form with each x being a number between 0 and 9, at that there is at least one x
    e.target.value.search(regex)==-1?
      this.setState({value:e.target.value, valid:false, backgroundColor : "#f2dede"}) :
      this.setState({value:e.target.value, valid:true,  backgroundColor:"#dff0d8"});
    this.setState({value : e.target.value},
      function(){
        if(this.state.value.length>=2){
          var xhr = new XMLHttpRequest();
          xhr.open('GET', encodeURI("/autocomplete/genes/"+this.state.value), true);
          var component = this;
          xhr.onload = function(){
            if(xhr.status==200){
              component.setState({autoCompleteData : JSON.parse(xhr.responseText).slice(0,10)})
            }else{
              console.error("GOAT here : We couldn't get your data. Check the route, or your connection");
            };
          };
          xhr.send();
        }
      }
    );
  },
  render : function(){

    var inputStyle={
      display : "block",
      width : "80%",
      height : "40px",
      margin : "auto",
      backgroundColor : this.props.type==this.props.activeType? this.state.backgroundColor : "#fff"
    }

    var geneComponent = function(gene, index){
      return <option key={index+gene.symbol}>{gene.symbol}</option>
    }

    return (
      <div>
        <input
          onChange={this.onChange}
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.activeType==this.props.type? this.state.value : ""}
          className={this.state.class}
          style={inputStyle}
          id="inputGene"
          list="listData"
          size="25"
        />
        <datalist id="listData">{this.state.autoCompleteData.map(geneComponent)}</datalist>
      </div>
    );
  }
});

module.exports = InputGene;
