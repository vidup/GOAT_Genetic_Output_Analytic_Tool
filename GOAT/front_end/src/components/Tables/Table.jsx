//Dependencies
var React = require('react');
var Griddle = require('griddle-react');

//Sub-components
var Button = require('../Buttons/Button.jsx');

//Component
var Table = React.createClass({
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

    var columnMeta = [
                    {
            "columnName": "rs_ID",
            "locked": false,
            "visible": true,
            "order": 1
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
        },
        {
            "columnName": "dbSNP",
            "locked": false,
            "visible": true,
            "customComponent": LinkComponentDbSNP,
            "order": 7
        }
    ];

    return (
      <div>
          <Griddle
            results={this.props.snps}
            enableInfiniteScroll={true}
            bodyHeight={500}
            showSettings={true}
            showFilter={true}
            noDataMessage={"No data"}
          />
          <Button text="Download in CSV" margin="auto" marginTop="15px"/>
      </div>
    );
  }
});

module.exports = Table;
