import React, { Component, PropTypes as Types } from 'react';
import { Map } from 'immutable';

class QuizInfoCard extends Component {
  static propTypes = {
    quiz: Types.instanceOf(Map).isRequired,
    getQuiz: Types.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onEditClick = this.onEditClick.bind(this);
  }

  onEditClick() {
    this.props.getQuiz(this.props.quiz.get('id'));
  }

  render() {
    const { quiz: { title, createdAt, updatedAt, users, isActive } } = this.props;
    return (
      <div className="card">
        <div className="card-block">
          <h4 className="card-title">{title}</h4>
          <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Loodud: {createdAt.format('LT, L')}</li>
          <li className="list-group-item">Muudetud: {updatedAt.format('LT, L')}</li>
          <li className="list-group-item">Vastajaid: {users}</li>
        </ul>
        <div className="card-block">
          <div className="btn-group col-xs-12 row">
            <button
              className={`btn btn-${isActive ? 'danger' : 'primary'} card-link`}
              disabled>
              {isActive ? 'Deaktiveeri' : 'Aktiveeri'}
            </button>
            <button
              className="btn btn-warning card-link"
              onClick={this.onEditClick}>
              Muuda <i className="fa fa-pencil-square-o" />
            </button>
          </div>
          <div className="btn-group btn-group-sm m-t-1">
            <button className="btn btn-secondary card-link" disabled>Vaata vastuseid</button>
          </div>
        </div>
      </div>
    );
  }
}

export default QuizInfoCard;
