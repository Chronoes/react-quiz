import React, { Component, PropTypes as Types } from 'react';

import { formGroupValidationClass } from '../util';

class UserRegister extends Component {
  static propTypes = {
    getQuiz: Types.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { username: { value: '', valid: null } };
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
  }

  onSubmitForm(event) {
    event.preventDefault();
    const { username } = this.state;
    username.value = username.value.trim();
    username.valid = username.value.length > 0;

    if (username.valid) {
      this.props.getQuiz(username);
    }
    this.setState({ username });
  }

  onUsernameChange({ target: { value } }) {
    this.setState({ username: { value, valid: null } });
  }

  render() {
    const { username } = this.state;
    return (
      <form className="form-inline" onSubmit={this.onSubmitForm}>
        <fieldset className={formGroupValidationClass(username.valid)}>
          <label htmlFor="username">Nimi</label>
          <input
            id="username"
            type="text"
            className="form-control"
            placeholder="Jane Doe"
            value={username.value}
            onChange={this.onUsernameChange} />
        </fieldset>
        <button type="submit" className="btn btn-primary">Alusta</button>
      </form>
    );
  }
}

export default UserRegister;
