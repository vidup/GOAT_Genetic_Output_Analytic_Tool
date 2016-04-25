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

//SubComponents

//Component
var InputAutoComplete = React.createClass({
  getInitialState: function(){
    return {
      value : "",
      class : "",
      backgroundColor : "#fff",
      autoCompleteData : []
    }
  },
  onChange : function(e){
    this.setState({value : e.target.value},
      function(){
        if(this.state.value.length>=2){
          var xhr = new XMLHttpRequest();
          xhr.open('GET', encodeURI(this.props.url+this.state.value), true);
          var component = this;
          xhr.onload = function(){
            if(xhr.status==200){
              component.setState({autoCompleteData : JSON.parse(xhr.responseText).slice(0,10)})
            }else{
              console.error("We couldn't get your data. Check the route, or your connection");
            };
          };
          xhr.send();
        }
      }
    );
  },
  render : function(){

    var props = this.props;
    var state = this.state;

    var dataComponent = function(component, index){
      if(props.property){
        return <option key={index+component[props.property]}>{component[props.property]}</option>;
      }else{
        return <option key={index+component[Object.keys(component)[0]]}>{component[Object.keys(component)[0]]}</option>;
      }
    }

    return (
      <div>
        <input
          onChange={this.onChange}
          type="text"
          placeholder={this.props.placeholder}
          className={this.props.className}
          id={this.props.id}
          list="listDataAutoComplete"
        />
        <datalist id="listDataAutoComplete">{this.state.autoCompleteData.map(dataComponent)}</datalist>
      </div>
    );
  }
});

module.exports= InputAutoComplete;
