import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import './styles/bootstrap.min.css';
// import zefoStyle from './styles/zefo.css';
import searchIcon from './images/search.svg';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="padding-20">
        <Row className="show-grid">
          <Col sm={7}>
            <input type="text" className="form-control" />
          </Col>
          <Col sm={5}>
            <img className="search-icon" src={searchIcon} width="30" height="30" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
