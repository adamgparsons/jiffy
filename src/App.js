import React, {Component} from 'react';
// Importing the spinner and assinging it to the variable loader
import loader from './images/loader.svg';
import Gif from './Gif';
import clearButton from './images/close-icon.svg';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/* If we have results show clear button otherwise show title */}
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {' '}
    {/* Determine if item is loading show spinner if not show the hint text */}{' '}
    {loading ? <img className="block mx-auto" src={loader} alt="loading" /> : hintText}{' '}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      // this is an array for the gifs
      gifs: []
    };
  }

  // we want a function that searches the Giphy API
  // fetch puts the search term into the query
  // then we can do something with the results

  searchGiphy = async searchTerm => {
    // first we try our fetch
    //here we set our loading state to be true
    //this will show the spinner at the bottom
    this.setState({
      loading: true
    });
    try {
      //here we use the await keyword to wait for the response to come back
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=JfSxEmSQYMargv746Rd6JXaa1FCGFTqM&q=${searchTerm}&limit=25&offset=0&rating=G&lang=en`
      );
      //here we convert our raw response into json data
      const {data} = await response.json();

      // here we grab a random result from the images
      const randomGif = randomChoice(data);

      // here we check if the array is empty
      // if it is we throw an error

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      console.log(data);
      console.log(randomGif);

      this.setState((prevState, props) => ({
        ...prevState,
        // here we take our spread to take the previous gifs
        // and spread them out and then add our random gif to the end
        gifs: [...prevState.gifs, randomGif],
        // we turn off the spinner
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }));
    } catch (error) {
      // if our fetch fails then we catch an error
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
    }
  };

  // with create react app we can write our methods
  // as arrow functions, meaning we don't need the constructor and bind
  handleChange = event => {
    this.setState((prevState, props) => ({
      // we take our old props and spread them out here
      ...prevState,
      // and then we overwrite the ones we want after
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
    console.log(event.key);

    const {value} = event.target;
    console.log(value);
    if (value.length > 2) {
    }
  };

  handleKeyPress = event => {
    const {value} = event.target;
    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value);
    }
  };

  //here we reset the state by clearing everything out
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));

    // here we grab the input and give it focus again
    this.textInput.focus();
  };
  //when we have two or more chars in the search box and we also press enter
  // we want to run a search

  render() {
    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length;
    let textInput = React.createRef();
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {' '}
          {/* {our stack of gif images} */}
          {this.state.gifs.map(gif => (
            <Gif {...gif} />
          ))}
          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        <UserHint {...this.state} />{' '}
      </div>
    );
  }
}

export default App;
