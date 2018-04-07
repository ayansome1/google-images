import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import './styles/bootstrap.min.css';
// import zefoStyle from './styles/zefo.css';
import searchIcon from './images/search.svg';
import prevIcon from './images/prev_icon.svg';
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
          data: res.data.items,
        });
        // this.state.loading = false;
      })
      .catch(err => {
        console.log('error in getting image', err);
      });

    function removeDiv(id) {
      var elem = document.getElementById(id);
      return elem.parentNode.removeChild(elem);
    }

    function addNewDiv(index, item, clickedItemIndex) {
      // implement it on page refresh
      var referenceNode = document.getElementById('img-box-' + index);

      // hide image if clicked again
      var x = document.getElementById('img-box-for-' + clickedItemIndex);
      if (x) {
        console.log(x.id);
        removeDiv(x.id);
        return;
      }

      // remove existing opened image
      var y = document.getElementsByClassName('image-open-details');
      if (y[0]) {
        removeDiv(y[0].id);
      }
      // for (let i = 0; i < y.length; i++) {
      //   removeDiv(y[i].id);
      // }

      // Create div for new image opened
      var newNode = document.createElement('div');
      newNode.id = 'img-box-for-' + clickedItemIndex;
      newNode.className = 'image-open-details col-sm-12';
      newNode.style.display = 'flex';
      newNode.style['align-items'] = 'center';
      newNode.style['justify-content'] = 'center';
      newNode.style['background-color'] = '#dee2e6';
      newNode.style.padding = '20px';

      // newNode.innerHTML = "<img " + src={prevIcon} + "style='width:40px;height:40px;'>";

      newNode.innerHTML = '<i class="left"></i>';
        // '<img className="" src="https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-arrow-left.svg" width="30px" height="30px" />';

      // <img className="search-icon" src={searchIcon} width="30" height="30" />

      newNode.innerHTML +=
        "<img src='" + item.link + '\' style="max-width:100%;max-height:300px;">';
      newNode.innerHTML += '<i class="right"></i>';

      referenceNode.after(newNode);
      // newNode.scrollIntoView();
    }

    let openImage = (index, item) => {
      console.log('clicked', index, ' item: ', item);

      var allImageHolder = document.getElementById('all-image-holder');

      var allImageItems = allImageHolder.getElementsByClassName('img-box');
      let totalImages = allImageItems.length;
      let lastItemOfClickedRow;

      console.log(window.innerWidth);

      let windowWidth = window.innerWidth;
      if (windowWidth <= 575) {
        lastItemOfClickedRow = index;
      } else if (windowWidth <= 767) {
        lastItemOfClickedRow = Math.ceil((index + 1) / 3) * 3 - 1;
      } else if (windowWidth <= 991) {
        lastItemOfClickedRow = Math.ceil((index + 1) / 4) * 4 - 1;
      } else {
        lastItemOfClickedRow = Math.ceil((index + 1) / 6) * 6 - 1;
      }
      lastItemOfClickedRow =
        lastItemOfClickedRow > totalImages - 1 ? totalImages - 1 : lastItemOfClickedRow;

      console.log(lastItemOfClickedRow);

      addNewDiv(lastItemOfClickedRow, item, index); // add new div below the clicked image
    };

    this.openImageHandler = (index, item) => {
      openImage(index, item);
    };
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
          <Col
            id={'img-box-' + index}
            sm={4}
            md={3}
            lg={2}
            key={index}
            className="img-box cursor-pointer"
            onClick={() => this.openImageHandler(index, item)}
          >
            <img src={item.image.thumbnailLink} className="image-fit" />
          </Col>
        );
      });
    }

    return (
      <div className="padding-20">
        <Row>
          <Col sm={7}>
            <input type="text" className="form-control" />
          </Col>
          <Col sm={5}>
            <img className="search-icon" src={searchIcon} width="30px" height="30px" />
          </Col>
        </Row>
        <Row id="all-image-holder">{data}</Row>
      </div>
    );
  }
}

export default App;
