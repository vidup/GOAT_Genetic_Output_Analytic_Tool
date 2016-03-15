//Dependencies
var React = require('react');

var Header = React.createClass({
  render: function(){
    var divStyle = {
      background : "#ededed",
      color : "#231c22",
      textAlign : "center",
      fontFamily : "Montserrat-Bold !important"
    }

    var titleStyle = {
      fontSize : '8em !important'
    }

    return(
      <div className="row" style={divStyle}>
        <div className = "col-12">
          <h1 style={titleStyle}>{this.props.title}</h1>
          <h2>{this.props.subtitle}</h2>
          {/*<img src = "static/img/GOAT.png"/>*/}
        </div>
      </div>
    )
  }
});


module.exports = Header;
