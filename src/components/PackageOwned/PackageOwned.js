/// react
import React, { Component } from 'react';

// css
import './PackageOwned.css';

class PackageOwned extends Component {
	render() {
		return (
			<div className="PackageOwned">
				<em className="PackageOwned-title">
					{this.props.name}
				</em>
				
				{/*
					These are float-right and so they must be included in reverse order
				*/}
				<button
					className="PackageOwned-remove PackageOwned-button body"
					onClick={() => this.props.removePackage(this.props.id)}>
					Remove
				</button>

				<button
					className="PackageOwned-edit PackageOwned-button body"
					onClick={() => this.props.editPackage(this.props.id)}>
					Edit
				</button>

				{/*
					Should be furthest left so that it doesn't break vertical
					lines when it toggles  
				*/}
				<button
					className="PackageOwned-togglePublish PackageOwned-button body"
					onClick={() => {
						this.props.togglePackagePublish(this.props.id,
							this.props.published);
					}}>
					{this.props.published ? "Unpublish" : "Publish"}
				</button>
			</div>
		);
	}

	componentDidMount() {
		let re = /^#togglePackagePublish-(\d+)$/;
		let match = location.hash.match(re);
		if (match && match[1] && this.props.id === Number(match[1])) {
			this.props.togglePackagePublish(this.props.id);
		}

		re = /^#editPackage-(\d+)$/;
		match = location.hash.match(re);
		if (match && match[1] && this.props.id === Number(match[1])) {
			this.props.editPackage(this.props.id);
		}

		re = /^#removePackage-(\d+)$/;
		match = location.hash.match(re);
		if (match && match[1] && this.props.id === Number(match[1])) {
			this.props.removePackage(this.props.id);
		}
	}
}

export default PackageOwned;