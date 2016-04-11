import React, { Component, PropTypes as Types } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import * as quizActions from '../actions/quizActions';

import AdminQuizForm from '../components/AdminQuizForm';
import NewQuizQuestion from '../components/NewQuizQuestion';
import StrikedText from '../components/StrikedText';

class AdminQuizPage extends Component {
  static propTypes = {
    actions: Types.object.isRequired,
    quiz: Types.instanceOf(Map).isRequired,
  };

  constructor(props) {
    super(props);

    this.onQuizTitleChange = this.onQuizTitleChange.bind(this);
    this.onQuizSave = this.onQuizSave.bind(this);
  }

  onQuizTitleChange(event) {
    this.props.actions.setTitle(event.target.value);
  }

  onQuizSave() {
    this.props.actions.saveQuiz(this.props.quiz);
  }

  render() {
    const { quiz, actions: { addQuestion, setQuestionTitle, setChoices, ...actions } } = this.props;
    const { title, questions, editingQuestion } = quiz;
    return (
      <div className="container">
        <div className="form-group row">
          <label className="form-control-label col-lg-2">Pealkiri</label>
          <div className="col-lg-10">
            <input type="text" className="editable-text h1" defaultValue={title} onChange={this.onQuizTitleChange} />
          </div>
        </div>
        <div className="form-group row">
          <label className="form-control-label col-lg-2">Küsimuse tüüp</label>
          <div className="col-lg-10">
            <NewQuizQuestion
              question={questions.get(editingQuestion)}
              questionId={editingQuestion}
              add={addQuestion}
              setTitle={setQuestionTitle}
              setChoices={setChoices} />
          </div>
        </div>
        <div className="center-block">
          <button className="btn btn-primary" onClick={this.onQuizSave}>Salvesta test</button>
        </div>
        <StrikedText>Eelvaade</StrikedText>
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

export default connect(({ quiz }) => ({ quiz }), mapDispatchToProps)(AdminQuizPage);
