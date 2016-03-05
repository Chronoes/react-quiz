import React, {Component, PropTypes as Types} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';

import {getQuiz} from '../actions/quizActions';

import UserRegister from '../components/UserRegister';

class UserPage extends Component {
  static displayName = 'UserPage';
  static propTypes = {
    actions: Types.shapeOf({
      getQuiz: Types.func,
      routeTo: Types.func,
    }).isRequired,
    quizReceived: Types.bool,
  };

  componentDidUpdate() {
    if (this.props.quizReceived) {
      this.props.actions.routeTo('/quiz');
    }
  }

  render() {
    return (
      <div>
        <UserRegister getQuiz={this.props.actions.getQuiz} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({getQuiz, routeTo: routeActions.push}, dispatch),
  };
}


export default connect(({quiz: id}) => ({quizReceived: id > 0}), mapDispatchToProps)(UserPage);
