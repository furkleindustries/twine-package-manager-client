// react
import React, { Component } from 'react';

// redux
import { connect, } from 'react-redux';
import store from '../../store';
import {
	setAccountCreatingName,
	setAccountCreatingPassword,
	setAccountCreatingEmail,
} from './AccountCreateModalActions';

// modules
import accountCreate from '../../modules/accountCreate';
import modalClose from '../../modules/modals/close';

// css
import './AccountCreateModal.css';

export class AccountCreateModal extends Component {
	constructor() {
		super();

		this.doCreateAccount = this.doCreateAccount.bind(this);
	}

	render() {
		return (
			<div className="AccountCreateModal">
				<h1 className="AccountCreateModal-title header">
					Create Account
				</h1>

				<div className="AccountCreateModal-fieldContainer">
					<div className="AccountCreateModal-infoPairContainer">
						<label
							className="AccountCreateModal-usernameLabel AccountCreateModal-label subheader"
							htmlFor="AccountCreateModal-username">
							Username
						</label>

						<input
							className="AccountCreateModal-usernameInput AccountCreateModal-input subheader"
							id="AccountCreateModal-username"
							value={this.props.name}
							onChange={e => store.dispatch(setAccountCreatingName(e.target.value))}
							ref={input => this.nameInput = input} 
							onKeyDown={e => {
								if (e.keyCode === 13) {
									this.doCreateAccount();
								}
							}} />
					</div>

					<div className="AccountCreateModal-infoPairContainer">
						<label
							className="AccountCreateModal-passwordLabel AccountCreateModal-label subheader"
							htmlFor="AccountCreateModal-password">
							Password
						</label>

						<input
							type="password"
							className="AccountCreateModal-passwordInput AccountCreateModal-input subheader"
							id="AccountCreateModal-password"
							value={this.props.password}
							onChange={e => store.dispatch(setAccountCreatingPassword(e.target.value))}
							onKeyDown={e => {
								if (e.keyCode === 13) {
									this.doCreateAccount();
								}
							}} />
					</div>

					<div className="AccountCreateModal-infoPairContainer">
						<label
							className="AccountCreateModal-emailLabel AccountCreateModal-label subheader"
							htmlFor="AccountCreateModal-email">
							E-mail
						</label>

						<input
							className="AccountCreateModal-emailInput AccountCreateModal-input subheader"
							id="AccountCreateModal-email"
							value={this.props.email}
							onChange={e => store.dispatch(setAccountCreatingEmail(e.target.value))}
							onKeyDown={e => {
								if (e.keyCode === 13) {
									this.doCreateAccount();
								}
							}} />
					</div>
				</div>

				<button
					className="AccountCreateModal-button wideButton"
					onClick={this.doCreateAccount}>
					Create Account
				</button>

				<p className="AccountCreateModal-message">
					{this.props.message}
				</p>
			</div>
		);
	}

	componentDidMount() {
		this.nameInput.focus();
	}

	async doCreateAccount() {
		const success = await accountCreate(
			this.props.name,
			this.props.password,
			this.props.email,
			this.props.csrfToken);

		if (success) {
			store.dispatch(setAccountCreatingName(''));
			store.dispatch(setAccountCreatingPassword(''));
			store.dispatch(setAccountCreatingEmail(''));

			modalClose();
		} else {
			store.dispatch(setAccountCreatingName(''));
			store.dispatch(setAccountCreatingPassword(''));

			this.nameInput.focus();
		}
	}
}

function mapStateToProps() {
	const state = store.getState();

	return {
		name: state.accountCreatingName,
		password: state.accountCreatingPassword,
		email: state.accountCreatingEmail,
		message: state.accountCreatingMessage,
		csrfToken: state.csrfToken,
	};
}

export default connect(mapStateToProps)(AccountCreateModal);