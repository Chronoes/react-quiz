import React, {Component, PropTypes as Types} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';
import {List} from 'immutable';

import QuizList from '../components/QuizList';

import * as quizListActions from '../actions/quizListActions';
import {resetQuizState} from '../actions/quizActions';

class QuizListPage extends Component {
  static propTypes = {
    quizList: Types.instanceOf(List).isRequired,
    actions: Types.object.isRequired,
    routeActions: Types.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.onClickNewQuiz = this.onClickNewQuiz.bind(this);
  }

  componentWillMount() {
    this.props.actions.getQuizList();
  }

  onClickNewQuiz() {
    this.props.actions.resetQuizState();
    this.props.routeActions.push('/admin/quiz');
  }

  render() {
    const {quizList} = this.props;
    return (
      <div className="container">
        <button className="btn btn-primary" onClick={this.onClickNewQuiz}>Uus</button>
        <hr />
        <QuizList>{quizList}</QuizList>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({resetQuizState, ...quizListActions}, dispatch),
    routeActions: bindActionCreators(routeActions, dispatch),
  };
}

export default connect(({quizList}) => ({quizList}), mapDispatchToProps)(QuizListPage);
