import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import './styles/bootstrap.min.css';
// import zefoStyle from './styles/zefo.css';
import searchIcon from './images/search.svg';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';

class App extends Component {
  // this.state = { loading: true };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    axios
      .get('http://www.mocky.io/v2/5ac7724f3100005700a574ed')
      .then(res => {
        // this.setState({ persons });
        console.log(res.data);
        this.setState({
          loading: false,
          data: res.data.items
        });
        // this.state.loading = false;
      })
      .catch(err => {
        console.log('error in getting nearby people', err);
      });
  }

  render() {
    let data;
    if (this.state.loading === true) {
      console.log(data);
      data = <div>Loading...</div>;
    } else {
      console.log(data);
      data = this.state.data.map((item, index) => {
        return (
          <span key={index} className="img-box cursor-pointer">
            <img src={item.image.thumbnailLink} />
          </span>
        );
        // return <img sm={3} key={index} className="img-box cursor-pointer" src={item.image.thumbnailLink} />;
      });
    }

    return (
      <div className="padding-20">
        <Row>
          <Col sm={7}>
            <input type="text" className="form-control" />
          </Col>
          <Col sm={5}>
            <img className="search-icon" src={searchIcon} width="30" height="30" />
          </Col>
        </Row>

        {data}
      </div>
    );
  }
}

export default App;
