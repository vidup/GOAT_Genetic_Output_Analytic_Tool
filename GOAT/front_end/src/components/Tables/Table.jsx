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

var Griddle = require('griddle-react');
var AreaSelectionActions = require('../../reflux/AreaSelectionActions.jsx');
var AreaSelectionStore = require('../../reflux/AreaSelectionStore.jsx');

//Sub-components
var Button = require('../Buttons/Button.jsx');
var PhenotypesTable = require('./PhenotypesTable.jsx');

//Component
var Table = React.createClass({
  mixins : [
    Reflux.listenTo(AreaSelectionStore, 'onChange')
  ],
  onChange : function(event, data){
    switch(event){
      case 'noData':
        this.refs.queryForm.setState({'submited' : false});
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
      submitedAreaSelection : false,
      message : ''
    }
  },
  download : function(e){
    e.preventDefault();
    console.log("Download csv");
  },
  render : function(){
    var table = this;
    var LinkAreaSelectionRSID = React.createClass({
        onClick : function(e){
          e.preventDefault();
          if(!table.state.submitedAreaSelection){
            table.setState({submitedAreaSelection : true});
            AreaSelectionActions.getAreaSelection(this.props.rowData.Chr, this.props.rowData.Pos, this.props.rowData.Phenotype, this.props.data, this.props.rowData.Phenotype);
          }else{
            alert('There is already a request being handled right now. Wait for a few seconds so that the application can get the data and display it');
          }
        },
        render: function (){
          return <a href="#" target="_blank" onClick = {this.onClick}>{this.props.rowData.rs_ID}</a>
        }
    });

    var columnMeta = [
                    {
            "columnName": "rs_ID",
            "locked": false,
            "visible": true,
            "order": 1,
            "customComponent" : LinkAreaSelectionRSID
        },
        {
            "columnName": "Chr",
            "locked": false,
            "visible": true,
            "order": 2
        },
        {
            "columnName": "Position",
            "locked": false,
            "visible": true,
            "order":3
        },
        {
            "columnName": "P-value",
            "locked": false,
            "visible": true,
            "order": 4
        },
        {
            "columnName": "GeneBefore",
            "locked": false,
            "visible": true,
            "order": 5
        },
        {
            "columnName": "Gene",
            "locked": false,
            "visible": true,
            "order": 6
        },
        {
            "columnName": "GeneAfter",
            "locked": false,
            "visible": true,
            "order": 7
        }
    ];

    var divStyle = {
      textAlign : 'center',
      color : '#ededed'
    }
    return (
      <div style={divStyle}>
          <h2>{this.state.message}</h2>
          <PhenotypesTable phenotypes = {this.props.phenotypes}/>
          <Griddle
            results={this.props.snps}
            enableInfiniteScroll={true}
            bodyHeight={1000}
            showSettings={true}
            showFilter={true}
            noDataMessage={"No data"}
            columnMetadata={columnMeta}
          />
          {/*<Button text="Download in CSV" margin="auto" marginTop="15px"/>*/}
      </div>
    );
  }
});

module.exports = Table;
