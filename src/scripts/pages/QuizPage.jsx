import React, { PropTypes as Types } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import * as quizActions from '../actions/quizActions';

import QuizForm from '../components/QuizForm';
import Timer from '../components/Timer';

/*
 * TODO: Use HTML5 sessionStorage to temporarily cache user answers
 * TODO: Display alerts for questions that have missing answers before sending to server, ask for confirmation
*/

function QuizPage({ quiz, actions: { timeStop, ...actions } }) {
  const { isRunning, timeLimit } = quiz;
  return (
    <div className="container">
      {isRunning ?
        <Timer
          timeLimit={timeLimit}
          finish={timeStop} /> : null}
      <QuizForm quiz={quiz} actions={actions} />
    </div>
  );
}

QuizPage.propTypes = {
  actions: Types.object.isRequired,
  quiz: Types.instanceOf(Map).isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(quizActions, dispatch),
  };
}

export default connect(({ quiz }) => ({ quiz }), mapDispatchToProps)(QuizPage);
