import React, {Component, PropTypes as Types} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import * as quizActions from '../actions/quizActions';

import AdminQuizForm from '../components/AdminQuizForm';
import NewQuizQuestion from '../components/NewQuizQuestion';

class AdminQuizPage extends Component {
  static propTypes = {
    actions: Types.object.isRequired,
    quiz: Types.instanceOf(Map).isRequired,
  };

  render() {
    const {quiz, actions: {addQuestion, ...actions}} = this.props;
    return (
      <div className="container">
        <NewQuizQuestion addQuestion={addQuestion} />
        <hr />
        <AdminQuizForm quiz={quiz} actions={actions} />
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
}, mapDispatchToProps)(AdminQuizPage);
