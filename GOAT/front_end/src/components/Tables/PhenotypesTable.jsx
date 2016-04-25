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
var Griddle = require('griddle-react');
var PhenotypesActions = require('../../reflux/PhenotypesActions.jsx');

//Component
var Table = React.createClass({
  getInitialState : function(){
    return {
      submitedAreaSelection : false
    }
  },
  download : function(e){
    e.preventDefault();
    console.log("Download csv");
  },
  render : function(){
    var table=this;
    var PhenotypeElement = React.createClass({
        onClick : function(){
          PhenotypesActions.setPhenotype(this.props.rowData.Phenotypes);
        },
        render: function (){
          var style = {
            cursor : "pointer"
          }
          return <div style={style} onClick={this.onClick}><p>{this.props.rowData.Phenotypes}</p></div>
        }
    });

    var columnMeta = [
        {
            "columnName": "Phenotypes",
            "locked": false,
            "visible": true,
            "order": 1,
            "customComponent" : PhenotypeElement
        }
    ];

    var divStyle = {
      width : "20%",
      display : "block",
      margin : "auto",
      textAlign : "center"
    }

    return (
      <div style={divStyle}>
          <Griddle
            results={this.props.phenotypes}
            showFilter = {true}
            noDataMessage={"No data"}
            columnMetadata={columnMeta}
          />
      </div>
    );
  }
});

module.exports = Table;
