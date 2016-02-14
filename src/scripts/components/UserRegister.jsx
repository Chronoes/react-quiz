import React, {Component, PropTypes as Types} from 'react';

class UserRegister extends Component {
  static propTypes = {
    getQuiz: Types.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  onSubmitForm(event) {
    event.preventDefault();
    const name = this.refs.userName.value.trim();
    if (name.length > 0) {
      this.props.getQuiz(name);
    }
  }

  render() {
    return (
      <div className="form-container">
        <form className="form-inline" onSubmit={this.onSubmitForm}>
          <div className="form-group">
            <label className="form-control-label">Nimi</label>
            <input type="text" ref="userName" className="form-control" placeholder="Jane Doe" required />
          </div>
          <button type="submit" className="btn btn-primary m-l-1">Alusta</button>
        </form>
      </div>
    );
  }
}

export default UserRegister;
