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

//Component
var ASTable = React.createClass({
  download : function(e){
    e.preventDefault();
    console.log("Download csv");
  },
  render : function(){
    var LinkComponentDbSNP = React.createClass({
        render: function () {
            url = "http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs="+this.props.rowData.rs_ID;
            return <a href={url} target="_blank">dbSNP : {this.props.rowData.rs_ID}</a>
        }
    });

    var LinkComponentGWASCatalogue = React.createClass({
        render: function () {
            urlrs = "http://www.ebi.ac.uk/gwas/search?query="+this.props.rowData.rs_ID;
            urlgeb = "http://www.ebi.ac.uk/gwas/search?query="+this.props.rowData.GeneBefore;
            urlge = "http://www.ebi.ac.uk/gwas/search?query="+this.props.rowData.Gene;
            urlgea = "http://www.ebi.ac.uk/gwas/search?query="+this.props.rowData.GeneAfter;

            return (
                <ul>
                    <li><a href={urlrs} target="_blank">rs_ID</a></li>
                    <li><a href={urlgeb} target="_blank">gene before</a></li>
                    <li><a href={urlge} target="_blank">gene</a></li>
                    <li><a href={urlgea} target="_blank">gene after</a></li>
                </ul>
            );
        }
    });
    var LinkComponentGenecards = React.createClass({
        render: function () {
            urlgeb = "http://www.genecards.org/cgi-bin/carddisp.pl?gene="+this.props.rowData.GeneBefore;
            urlge = "http://www.genecards.org/cgi-bin/carddisp.pl?gene="+this.props.rowData.Gene;
            urlgea = "http://www.genecards.org/cgi-bin/carddisp.pl?gene="+this.props.rowData.GeneAfter;

            return (
                <ul>
                    <li><a href={urlgeb} target="_blank">gene before</a></li>
                    <li><a href={urlge} target="_blank">gene</a></li>
                    <li><a href={urlgea} target="_blank">gene after</a></li>
                </ul>
            );
        }
    });

    //Custom header. Allow to search for specific value.
    var HeaderComponent = React.createClass({
      textOnClick: function(e) {
        e.stopPropagation();
      },

      filterText: function(e) {
        this.props.filterByColumn(e.target.value, this.props.columnName)
      },

      render: function(){
        return (
          <span>
            <div><strong>{this.props.displayName}</strong></div>
            <input type='text' onChange={this.filterText} onClick={this.textOnClick} />
          </span>
        );
      }
    });


    var columnMeta = [
                    {
            "columnName": "rs_ID",
            "displayName" : "rs_ID",
            "locked": false,
            "visible": true,
            "order": 1,
            "customHeaderComponent" : HeaderComponent        },
        {
            "columnName": "Chr",
            "locked": false,
            "visible": true,
            "order": 2,
            "customHeaderComponent" : HeaderComponent
        },
        {
            "columnName": "Position",
            "locked": false,
            "visible": true,
            "order":3,
            "customHeaderComponent" : HeaderComponent
        },
        {
            "columnName": "P-value",
            "locked": false,
            "visible": true,
            "order": 4,
            "customHeaderComponent" : HeaderComponent
        },
        {
            "columnName": "GeneBefore",
            "locked": false,
            "visible": true,
            "order": 5,
            "customHeaderComponent" : HeaderComponent
        },
        {
            "columnName": "Gene",
            "locked": false,
            "visible": true,
            "order": 6,
            "customHeaderComponent" : HeaderComponent
        },
        {
            "columnName": "GeneAfter",
            "locked": false,
            "visible": true,
            "order": 7,
            "customHeaderComponent" : HeaderComponent
        },
        {
            "columnName": "dbSNP",
            "locked": false,
            "visible": true,
            "customComponent": LinkComponentDbSNP,
            "customHeaderComponent" : HeaderComponent,
            "order": 8
        },
        {
            "columnName": "GWAS_Catalog",
            "locked": false,
            "visible": true,
            "customComponent": LinkComponentGWASCatalogue,
            "order": 9
        },
        {
            "columnName": "Genecards",
            "locked": false,
            "visible": true,
            "customComponent": LinkComponentGenecards,
            "order": 10
        }
    ];

    return (
      <div>
          <Griddle
            results={this.props.snps}
            enableInfiniteScroll={true}
            bodyHeight={1000}
            showSettings={true}
            showFilter={true}
            noDataMessage={"No data"}
            columnMetadata={columnMeta}
          />
      </div>
    );
  }
});

module.exports = ASTable;
