import React, {
  Component
} from 'react';

class Gif extends Component {
  //when our video has loaded we added a loaded classname
  //otherwise our video stays hidden
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    };
  }
  render() {
    const {
      loaded
    } = this.state;
    const {
      images
    } = this.props;
    return ( <
      video
      //when the video has loaded we add a loaded class
      className = {
        `grid-item video ${loaded && 'loaded'}`
      }
      autoPlay loop src = {
        images.original.mp4
      }
      //when the video has loaded we set state to loaded
      onLoadedData = {
        () => this.setState({
          loaded: true
        })
      }
      />
    );
  }
}

export default Gif;
