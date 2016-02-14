import React, {Component, PropTypes as Types} from 'react';

import moment from 'moment';

class Timer extends Component {
  static propTypes = {
    finish: Types.func.isRequired,
    timeLimit: Types.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {time: 0};
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const {timeLimit} = this.props;
      const {time} = this.state;
      if (timeLimit && timeLimit <= time) {
        this.endTimer();
      } else {
        this.setState({time: this.state.time + 1});
      }
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer !== null) {
      this.endTimer();
    }
  }

  endTimer() {
    clearInterval(this.timer);
    this.timer = null;
    this.props.finish(this.state.time);
  }

  render() {
    const {timeLimit} = this.props;
    const {time} = this.state;
    const timeDisplay = moment.unix(timeLimit - time);
    return (
      <div>
        {timeDisplay.format(timeLimit > 3600 ? 'hh:mm:ss' : 'mm:ss')}
      </div>
    );
  }
}

export default Timer;
