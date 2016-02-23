//Dependencies
var React = require('react');
var Griddle = require('griddle-react');

//Component
var Table = React.createClass({
  render : function(){
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
      </div>
    );
  }
});

module.exports = Table;
