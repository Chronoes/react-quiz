import React, {Component, PropTypes as Types} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import * as quizActions from '../actions/quizActions';

import QuizForm from '../components/QuizForm';
import Timer from '../components/Timer';

class QuizPage extends Component {
  static propTypes = {
    actions: Types.object.isRequired,
    quiz: Types.instanceOf(Map).isRequired,
  };

  render() {
    const {quiz, actions: {timeStop, ...actions}} = this.props;
    return (
      <div className="container">
        {quiz.get('isRunning') ?
          <Timer
            timeLimit={quiz.get('timeLimit')}
            finish={timeStop} /> : null}
        <QuizForm quiz={quiz} actions={actions} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(quizActions, dispatch),
  };
}

export default connect(({quiz}) => {
  return {quiz};
}, mapDispatchToProps)(QuizPage);
