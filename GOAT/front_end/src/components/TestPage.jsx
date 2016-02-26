//Dependencies
var React = require('react');

//SubComponents
// var Chart = require('./Charts/Chart.jsx');

//Test Data

//Component
var TestPage = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  render: function() {
    return (
      <div>
        <div id="graph" className="col-sm-12">

        </div>
      </div>
    );
  }
});

module.exports = TestPage;
