import React, { Component, PropTypes as Types } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { List } from 'immutable';

import QuizList from '../components/QuizList';

import * as quizListActions from '../actions/quizListActions';
import { resetQuizState, getQuizById } from '../actions/adminActions';

class QuizListPage extends Component {
  static propTypes = {
    quizList: Types.instanceOf(List).isRequired,
    actions: Types.object.isRequired,
    routerActions: Types.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.onClickNewQuiz = this.onClickNewQuiz.bind(this);
    this.onEditQuiz = this.onEditQuiz.bind(this);
  }

  componentWillMount() {
    this.props.actions.getQuizList();
  }

  onClickNewQuiz() {
    this.props.actions.resetQuizState();
    this.props.routerActions.push('/admin/quiz');
  }

  onEditQuiz(id) {
    this.props.actions.getQuizById(id);
    this.props.routerActions.push('/admin/quiz');
  }

  render() {
    const { quizList, actions: { changeStatus } } = this.props;
    return (
      <div className="container">
        <button className="btn btn-primary" onClick={this.onClickNewQuiz}>Uus</button>
        <hr />
        <QuizList getQuiz={this.onEditQuiz} changeStatus={changeStatus}>{quizList}</QuizList>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ resetQuizState, getQuizById, ...quizListActions }, dispatch),
    routerActions: bindActionCreators(routerActions, dispatch),
  };
}

export default connect(({ admin: { quizList } }) => ({ quizList }), mapDispatchToProps)(QuizListPage);
