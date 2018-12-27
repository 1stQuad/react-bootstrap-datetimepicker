import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ParentComponent from './ParentComponent';

class Basic extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h2>Controlled Component example</h2>
            <ParentComponent />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  React.createFactory(Basic)(),
  document.getElementById('example'),
);
