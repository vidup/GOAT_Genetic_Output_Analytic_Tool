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


//Dependencies
var React = require('react');
var ReactDOM = require('react-dom');

//Sub-Components

//Component
var ManhattanPage = React.createClass({
  componentDidMount : function(){
    eval(this.props.function);
  },
  render : function(){
    var titleStyle = {
      textAlign : "center",
      color : "#ededed"
    }

    return(
      <div
        id={$.parseXML(this.props.div).firstChild.id}
        className = {$.parseXML(this.props.div).firstChild.className}
        >
        <h1 style={titleStyle}>ManhattanPage</h1>
      </div>
    )
  }
});

module.exports= ManhattanPage;
