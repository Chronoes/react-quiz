import React, { Component, PropTypes as Types } from 'react';
import { Map } from 'immutable';
import moment from 'moment';

class QuizInfoCard extends Component {
  static propTypes = {
    quiz: Types.instanceOf(Map).isRequired,
    getQuiz: Types.func.isRequired,
    changeStatus: Types.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onEditClick = this.onEditClick.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
  }

  onEditClick() {
    this.props.getQuiz(this.props.quiz.get('id'));
  }

  onStatusChange() {
    const { changeStatus, quiz } = this.props;
    changeStatus(quiz, quiz.get('status') === 'active' ? 'passive' : 'active');
  }

  render() {
    const { quiz: { title, createdAt, updatedAt, users, status } } = this.props;
    const isActive = status === 'active';
    return (
      <div className="card">
        <div className="card-block">
          <h4 className="card-title">{title}</h4>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Loodud: {moment(createdAt).format('LT, L')}</li>
          <li className="list-group-item">Muudetud: {moment(updatedAt).format('LT, L')}</li>
          <li className="list-group-item">Vastajaid: {users}</li>
        </ul>
        <div className="card-block">
          <div className="btn-group col-xs-12 row">
            <button
              className={`btn btn-${isActive ? 'danger' : 'primary'} card-link`}
              onClick={this.onStatusChange}
              disabled>
              {isActive ? 'Deaktiveeri' : 'Aktiveeri'}
            </button>
            <button
              className="btn btn-warning card-link"
              onClick={this.onEditClick}
              disabled>
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
