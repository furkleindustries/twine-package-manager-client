// react
import React, { Component, } from 'react';

// redux
import { connect, } from 'react-redux';
import store from '../../store';
import { setUsername, setPassword, } from './loginActions';

// components
import AccountCreateModal from '../../modals/AccountCreateModal/AccountCreateModal.js';

// modules
import login from '../../modules/login';
import modalCreateCreateAccount from '../../modules/modalCreateCreateAccount';

// css
import './login.css';

class LoginPane extends Component {
	render() {
		return (
			<div className="Login paneContainer">
				<div className="Login-fieldContainer">
					<div className="Login-infoPairContainer">
						<label
							className="Login-usernameLabel Login-label subheader"
							htmlFor="Login-username">
							Username
						</label>
						<input
							className="Login-usernameInput Login-input subheader"
							id="Login-username"
							value={this.props.username}
							ref={input => this.usernameInput = input}
							onChange={e => store.dispatch(setUsername(e.target.value))} 
							onKeyDown={e => {
								if (e.keyCode === 13) {
									login(this.props.username, this.props.password);

									// set the focus to the username
									this.usernameInput.focus();
								}
							}} />
					</div>

					<div className="Login-infoPairContainer">
						<label
							className="Login-passwordLabel Login-label subheader"
							htmlFor="Login-password">
							Password
						</label>
						<input
							type="password" 
							className="Login-passwordInput Login-input subheader"
							id="Login-password"
							value={this.props.password}
							onChange={e => store.dispatch(setPassword(e.target.value))}
							onKeyDown={e => {
								if (e.keyCode === 13) {
									login(this.props.username, this.props.password);

									// set the focus to the username
									this.usernameInput.focus();
								}
							}} />
					</div>
				</div>

				<button
					className="wideButton"
					onClick={() => {
						login(this.props.username, this.props.password);

						// set the focus to the username
						this.usernameInput.focus();
					}}>
					<span>Login</span>
				</button>

				<button
					className="wideButton"
					onClick={modalCreateCreateAccount}>
					<span>Create Account</span>
				</button>

				<p className="Login-error">
					{this.props.error}
				</p>
			</div>
		);
	}

	componentDidMount() {
		if (location.hash === '#createAccount') {
			modalCreateCreateAccount();
		}
	}
}

function mapStateToProps() {
	const state = store.getState();

	return {
		username: state.username,
		password: state.password,
		error: state.loginError,
	};
}

export default connect(mapStateToProps)(LoginPane);