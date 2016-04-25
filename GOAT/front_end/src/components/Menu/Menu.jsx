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

//Sub Components
var MenuItem = require('./MenuItem.jsx');
var HamButton = require('../Buttons/Hambutton.jsx');

//Actual Component
var Menu = React.createClass({
  getInitialState : function(){
    return {
      visibility : "none"
    }
  },
  onButtonHover : function(){
    this.setState({visibility : "block"})
  },
  onMenuLeave : function(){
    this.setState({visibility : "none"})
  },
  render : function(){
    var divStyle = {
      backgroundColor : '#323a44',
      color : "#ededed",
      display: this.state.visibility,
  		position : "absolute",
  		left :" 0",
      listStyle : "none",
      padding : 0,
      width : 350,
      zIndex : 9999
    }

    var buttonStyle = {
      display:"inline-block",
      position : "fixed",
      left : "15px",
      top : "30px",
      fontSize : "5em",
      zIndex : "10",
      cursor : "pointer",
      color : this.state.buttonColor
    }

    var createMenuItem = function(item, index){
      return <MenuItem key={index+item.content} content={item.content} url={item.url} action={item.action}/>
    }
    return (
      <div>
        <div
          style={buttonStyle}
          onMouseOver={this.onButtonHover}
          onMouseLeave = {this.onButtonLeave}>
          <HamButton />
        </div>
        <ul
            style={divStyle}
            className="menu"
            onMouseLeave={this.onMenuLeave}>
            {this.props.items.map(createMenuItem)}
        </ul>
      </div>
    );
  }
});

module.exports = Menu;
