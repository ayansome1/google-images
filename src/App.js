import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import './styles/bootstrap.min.css';
// import zefoStyle from './styles/zefo.css';
import searchIcon from './images/search.svg';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';

class App extends Component {
  componentDidMount() {
    axios.get('http://www.mocky.io/v2/5ac7724f3100005700a574ed').then(res => {
      // this.setState({ persons });
      console.log(res.data);
    });
  }

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
