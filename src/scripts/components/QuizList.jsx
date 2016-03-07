import React, {Component, PropTypes as Types} from 'react';
import {List} from 'immutable';

import QuizInfoCard from '../components/QuizInfoCard';

class QuizList extends Component {
  static propTypes = {
    children: Types.instanceOf(List).isRequired,
    getQuiz: Types.func.isRequired,
  };

  static GROUP_SIZE = 3;

  render() {
    const {children, getQuiz} = this.props;
    return (
      <div>
        {children.groupBy((_, i) => Math.floor(i / QuizList.GROUP_SIZE))
          .map((quizGroup, i) => (
            <div key={i} className="row card-deck-wrapper">
              <div className="card-deck">
                {quizGroup.map((quiz, j) => <QuizInfoCard key={j} getQuiz={getQuiz} quiz={quiz} />)}
              </div>
            </div>))
          .toArray()}
      </div>
    );
  }
}

export default QuizList;
