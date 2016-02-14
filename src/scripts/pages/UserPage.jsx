import React, {Component, PropTypes as Types} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';

import {getQuiz} from '../actions/quizActions';

import UserRegister from '../components/UserRegister';

class UserPage extends Component {
  static displayName = 'UserPage';
  static propTypes = {
    dispatch: Types.func.isRequired,
    quizReceived: Types.bool,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators({getQuiz}, props.dispatch);
  }

  componentDidUpdate() {
    if (this.props.quizReceived) {
      this.props.dispatch(routeActions.push('/quiz'));
    }
  }

  render() {
    return (
      <div>
        <UserRegister getQuiz={this.actions.getQuiz} />
      </div>
    );
  }
}

export default connect(({quiz}) => {
  return {quizReceived: quiz.get('id') > 0};
})(UserPage);
