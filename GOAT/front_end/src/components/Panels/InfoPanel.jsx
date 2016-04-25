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

//Components
var Button = require('../Buttons/Button.jsx');

var InfoPanel = React.createClass({
  handleClick:function() {
    console.log('You clicked on the '+this.props.heading)
  },
  handleMouseOver: function() {
    // this.setState({cursor : pointer})
  },
  handleMouseLeave: function() {
    // this.setState({})
  },
  render: function() {
    var divStyle = {
      boxShadow: '0 2px 20px 2px rgba(100,100,100,0.2), inset 0 2px 20px 2px rgba(100,100,100,0.1)',
      borderRadius: '10',
      textAlign: 'center',
      marginTop: '20',
      background: 'white',
      cursor : 'pointer'
    };
    if (this.props.background) {
      divStyle.background = this.props.background;
    }
    if(this.props.height) {
      divStyle.height = this.props.height;
    }

    var headingStyle = {
      color: '#000'
    };
    if(this.props.headingBackground) {
      headingStyle.background = this.props.headingBackground;
    }

    var contentStyle = {
      fontFamily: 'Helvetica',
      fontStyle: 'bold',
      fontSize: '18',
      color: '#777'
    };
    if(this.props.contentColor) {
      contentStyle.color = this.props.contentColor;
    }

    var cautionDisplay= function(caution){
        return (
          <div style={contentStyle} className="col-sm-12 bg-warning">
              <p>{caution}</p>
          </div>
        );
    };

    return (
      <div onClick={this.handleClick}
           onMouseOver={this.handleMouseOver}
           onMouseLeave={this.handleMouseLeave}
           style={divStyle}
           className={this.props.size || "gray-dark col-xs-10 col-sm-4 col-md-3 col-xs-offset-1 col-sm-offset-0 col-md-offset-1"}>

          <div style={headingStyle} className="col-sm-12">
              <h1>{this.props.heading}</h1>
          </div>
          <div style={contentStyle} className="col-sm-12">
              <p>{this.props.content}</p>
          </div>
          <div style={contentStyle} className="col-sm-12">
              <p className = "bg-warning">{this.props.caution}</p>
          </div>
          <Button url={this.props.url} action={this.props.action}/>
      </div>
    )
  }
});

module.exports = InfoPanel;
