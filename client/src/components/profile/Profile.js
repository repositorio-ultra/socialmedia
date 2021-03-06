import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getProfileById } from '../../actions/profile'
import { Link } from 'react-router-dom'

/* match é desestruturaçao do props, que recebe da url o parametro id e passa pela higher order function match */
const Profile = ({getProfileById, profile:{profile, loading }, auth, match}) => {
	useEffect(()=>{
		getProfileById(match.params.id);
	},[getProfileById])
	return (
		<Fragment>
			{ profile === null || loading ? (<Spinner />
			): (
			<Fragment>
				<Link to="/profiles" className="btn btn-primary">Return to Profiles</Link>
				{ auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&(<Link to="/edit-profile" className="btn btn-dark">Edit Profile</Link>) }
			</Fragment>
			)}
		</Fragment>
	)
}

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth
})
export default connect(mapStateToProps, {getProfileById })(Profile)
