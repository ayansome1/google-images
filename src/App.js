import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import searchIcon from './images/search.svg';
import prevIcon from './images/prev_icon.svg';
import { Bootstrap, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
let num = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, start: 1, searchedWord: '', dataLoaded: false };
    this.addNewDiv = this.addNewDiv.bind(this);
    this.openImage = this.openImage.bind(this);
    this.getImages = this.getImages.bind(this);
    this.searchImages = this.searchImages.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    let lastSearchedWord = window.sessionStorage.getItem('lastSearchedWord');

    if (lastSearchedWord) {
      // this.getImages(lastSearchedWord);
      this.setState({ word: lastSearchedWord });

      this.setState({ searchedWord: lastSearchedWord });
    }
    this.getImages(lastSearchedWord);
    // this.openImage();
    // this.openImageHandler = (index, item) => {
    //   openImage(index, item);
    // };
  }

  getImages(word /* , start, num*/) {
    console.log(word, this.state.start, num);

    let url =
      'https://www.googleapis.com/customsearch/v1?key=AIzaSyDb5J1g2o1PXmOQTgdRX4sYWcCUfXup2iU&cx=006532907512921989364:ybctrnxiwza&searchType=image';
    url = url + '&q=' + word;
    url = url + '&start=' + this.state.start;
    url = url + '&num=' + num;

    console.log(url);

    // let newStart = this.state.start + num;

    axios
      .get(url)
      .then(res => {
        console.log(res.data);
        this.setState(
          {
            loading: false,
            data: res.data.items, // this.state.data.push(...res.data.items),
            firstItemIndex: 0,
            lastItemIndex: res.data.items.length - 1,
            start: 1,
            dataLoaded: true,
          },
          () => {
            if (!window.sessionStorage.getItem('link')) {
              var y = document.getElementsByClassName('image-open-details');
              if (y[0]) {
                this.removeDiv(y[0].id);
              }
            }
            // to retain expanding image preview on page refresh
            let items = this.state.data;

            for (let it in items) {
              if (
                items[it].link === window.sessionStorage.getItem('link') &&
                items[it].image.thumbnailLink === window.sessionStorage.getItem('thumbnailLink')
              ) {
                console.log('******FOUND*********');
                this.openImage(parseInt(it), items[it]);

                break;
              }
            }
          }
        );
      })
      .catch(err => {
        console.log('error in getting image', err);
      });
  }

  loadMore() {
    let url =
      'https://www.googleapis.com/customsearch/v1?key=AIzaSyDb5J1g2o1PXmOQTgdRX4sYWcCUfXup2iU&cx=006532907512921989364:ybctrnxiwza&searchType=image';

    let newStart = this.state.start + num;

    url = url + '&q=' + this.state.searchedWord;
    url = url + '&start=' + newStart;
    url = url + '&num=' + num;

    console.log(url);

    axios
      .get(url)
      .then(res => {
        console.log(res.data);

        let newLastItemIndex = this.state.lastItemIndex + res.data.items.length;

        let newData = this.state.data;
        newData.push(...res.data.items);

        this.setState(
          {
            // loading: false,
            data: newData, // this.state.data.push(...res.data.items),
            // firstItemIndex: 0,
            lastItemIndex: newLastItemIndex,
            start: newStart,
          } /* ,
          () => {
            // to retain expanding image preview on page refresh
            let items = this.state.data;

            for (let it in items) {
              if (
                items[it].link === window.sessionStorage.getItem('link') &&
                items[it].image.thumbnailLink === window.sessionStorage.getItem('thumbnailLink')
              ) {
                this.openImage(parseInt(it), items[it]);

                break;
              }
            }
          } */
        );
      })
      .catch(err => {
        console.log('error in getting image', err);
      });
  }

  removeDiv(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
  }

  addNewDiv(index, item, clickedItemIndex) {
    var referenceNode = document.getElementById('img-box-' + index);

    // hide image if clicked again
    var x = document.getElementById('img-box-for-' + clickedItemIndex);
    if (x) {
      console.log(x.id);
      this.removeDiv(x.id);
      return;
    }

    // remove existing opened image
    var y = document.getElementsByClassName('image-open-details');
    if (y[0]) {
      this.removeDiv(y[0].id);
    }

    // Create div for new image opened
    var newNode = document.createElement('div');
    newNode.id = 'img-box-for-' + clickedItemIndex;
    newNode.className = 'image-open-details col-sm-12';
    newNode.style.display = 'flex';
    newNode.style['align-items'] = 'center';
    newNode.style['justify-content'] = 'center';
    newNode.style['background-color'] = '#dee2e6';
    newNode.style.padding = '20px';

    newNode.innerHTML =
      '<i id="left-arrow" class="left cursor-pointer" style="position: absolute;left: 30px;"></i>';

    newNode.innerHTML += "<img src='" + item.link + '\' style="max-width:100%;max-height:300px;">';
    newNode.innerHTML +=
      '<i id="right-arrow" class="right cursor-pointer" style="position: absolute;right: 30px;"></i>';

    referenceNode.after(newNode);
    // newNode.scrollIntoView();
    let leftArrow = document.getElementById('left-arrow');
    leftArrow.onclick = () => {
      console.log('---', this.state);
      console.log(this.state.openedImageId - 1, this.state.data[this.state.openedImageId - 1]);

      if (this.state.openedImageId - 1 >= this.state.firstItemIndex) {
        this.openImage(this.state.openedImageId - 1, this.state.data[this.state.openedImageId - 1]);
      }
    };

    let rightArrow = document.getElementById('right-arrow');
    rightArrow.onclick = () => {
      console.log('---', this.state);
      console.log(this.state.openedImageId + 1, this.state.data[this.state.openedImageId + 1]);

      if (this.state.openedImageId + 1 <= this.state.lastItemIndex) {
        this.openImage(this.state.openedImageId + 1, this.state.data[this.state.openedImageId + 1]);
      }
    };
  }

  openImage(index, item) {
    this.setState({ openedImageId: index });
    window.sessionStorage.setItem('link', item.link);
    window.sessionStorage.setItem('thumbnailLink', item.image.thumbnailLink);
    // window.sessionStorage.setItem('lastSearchedWord', this.state.searchedWord);

    var allImageHolder = document.getElementById('all-image-holder');

    var allImageItems = allImageHolder.getElementsByClassName('img-box');
    let totalImages = allImageItems.length;
    let lastItemOfClickedRow;

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

    this.addNewDiv(lastItemOfClickedRow, item, index); // add new div below the clicked image
  }

  openImageHandler(index, item) {
    this.openImage(index, item);
  }

  searchImages() {
    window.sessionStorage.removeItem('link');
    console.log(window.sessionStorage.getItem('link'));
    window.sessionStorage.removeItem('thumbnailLink');
    this.setState({ searchedWord: this.state.word });
    this.getImages(this.state.word /*, this.state.start, num*/);
    console.log('clicked');

    // window.sessionStorage.removeItem('lastSearchedWord');

    window.sessionStorage.setItem('lastSearchedWord', this.state.word);
  }

  handleInputChange(e) {
    this.setState({ word: e.target.value });
    console.log(e.key);
    if (e.keyCode === 13) {
      this.searchImages();
      // console.log('value', e.target.value);
      // put the login here
    }
    // console.log(e.target.value);
    // this.setState({ value: e.target.value });
  }

  render() {
    let data, loadMore;
    if (this.state.loading === true) {
      console.log(data);
      data = null; //<div>Loading...</div>;
    } else {
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

    if (this.state.dataLoaded) {
      loadMore = (
        <Row>
          <button className="load-more" onClick={this.loadMore}>
            Load more{' '}
          </button>
        </Row>
      );
    }

    return (
      <div className="padding-20">
        <Row>
          <Col sm={7}>
            <input
              value={this.state.word}
              type="text"
              className="form-control margin-bottom-10"
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.searchImages();
                }
              }}
              onChange={this.handleInputChange.bind(this)}
            />
          </Col>
          <Col sm={5}>
            <img className="search-icon" onClick={this.searchImages} src={searchIcon} />
          </Col>
        </Row>
        <Row id="all-image-holder">{data}</Row>
        {loadMore}
      </div>
    );
  }
}

export default App;
