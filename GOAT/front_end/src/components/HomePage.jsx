//Dependencies
var React = require('react');
var SnpActions = require('../reflux/SnpActions.jsx');

//Sub Components
var InfoPanel = require('./Panels/InfoPanel.jsx');

//Component
var HomePage = React.createClass({
  render : function(){

    /* ******* Modules Panels ******* */
    modulesData = require('./ComponentsData/modulesList');

    var createModules = function(module, index){
      return (
        <InfoPanel key={index + module.heading}
          heading = {module.heading}
          content = {module.content}
          height = {module.height}
          size = {module.size}
          caution = {module.caution || null}
          url={module.url}
          action = {module.action}
        />
      );
    }

    return (
      <div >
          {modulesData.map(createModules)}
      </div>
    );
  }
});

module.exports = HomePage;
