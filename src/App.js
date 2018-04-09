import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import searchIcon from './images/search.svg';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import config from './config/config.json';
let num = 10;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, start: 1, searchedWord: '', dataLoaded: false, word: '' };
    this.addNewDiv = this.addNewDiv.bind(this);
    this.openImage = this.openImage.bind(this);
    this.getImages = this.getImages.bind(this);
    this.searchImages = this.searchImages.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    let lastSearchedWord = window.sessionStorage.getItem('lastSearchedWord');

    if (lastSearchedWord) {
      this.setState({ word: lastSearchedWord });

      this.setState({ searchedWord: lastSearchedWord });
      this.getImages(lastSearchedWord);
    }
  }

  getImages(word) {
    let url = config.baseUrl + '&key=' + config.key + '&cx=' + config.cx;
    url = url + '&q=' + word;
    url = url + '&start=' + 1;
    url = url + '&num=' + num;

    console.log(url);

    axios
      .get(url)
      .then(res => {
        this.setState(
          {
            loading: false,
            data: res.data.items,
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
    let url = config.baseUrl + '&key=' + config.key + '&cx=' + config.cx;

    let newStart = this.state.start + num;

    url = url + '&q=' + this.state.searchedWord;
    url = url + '&start=' + newStart;
    url = url + '&num=' + num;

    console.log(url);

    axios
      .get(url)
      .then(res => {
        let newLastItemIndex = this.state.lastItemIndex + res.data.items.length;

        let newData = this.state.data;
        newData.push(...res.data.items);

        this.setState({
          data: newData,
          lastItemIndex: newLastItemIndex,
          start: newStart,
        });
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
      if (this.state.openedImageId - 1 >= this.state.firstItemIndex) {
        this.openImage(this.state.openedImageId - 1, this.state.data[this.state.openedImageId - 1]);
      }
    };

    let rightArrow = document.getElementById('right-arrow');
    rightArrow.onclick = () => {
      if (this.state.openedImageId + 1 <= this.state.lastItemIndex) {
        this.openImage(this.state.openedImageId + 1, this.state.data[this.state.openedImageId + 1]);
      }
    };
  }

  openImage(index, item) {
    this.setState({ openedImageId: index });
    window.sessionStorage.setItem('link', item.link);
    window.sessionStorage.setItem('thumbnailLink', item.image.thumbnailLink);

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
    window.sessionStorage.removeItem('thumbnailLink');
    this.setState({ searchedWord: this.state.word });
    if (this.state.word) {
      this.getImages(this.state.word);
    }

    window.sessionStorage.setItem('lastSearchedWord', this.state.word);
  }

  handleInputChange(e) {
    this.setState({ word: e.target.value });
  }

  render() {
    let data, loadMore;
    if (this.state.loading === true) {
      data = null;
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
              placeholder="Type and press enter to search..."
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
