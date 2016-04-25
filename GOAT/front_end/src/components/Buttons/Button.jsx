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

{/*<button type="button" class="btn btn-primary">Primary</button>  // Here, put another React component for the button*/}
//Dependencies
var React = require('react');
var SnpActions = require('../../reflux/SnpActions.jsx');

var Button = React.createClass({
  getInitialState: function(){
    return {
      className : "btn btn-primary"
    }
  },
  handleClick:function() {
    this.setState({className : "btn btn-success"});
    this.props.action();
  },
  render: function(){
    var buttonStyle= {
      display : "block",
      margin : this.props.margin? this.props.margin : "auto",
      marginBottom : 15,
      marginTop : this.props.marginTop? this.props.marginTop : 0
    }
    return (<button onClick={this.handleClick} type="button" className={this.state.className} style={buttonStyle}>{this.props.text? this.props.text : "Access"}</button>);
  }
});

module.exports = Button;
