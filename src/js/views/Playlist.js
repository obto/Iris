
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
let helpers = require('../helpers.js')

import TrackList from '../components/TrackList'
import Thumbnail from '../components/Thumbnail'
import Dater from '../components/Dater'

import * as spotifyActions from '../services/spotify/actions'
import * as mopidyActions from '../services/mopidy/actions'

class Playlist extends React.Component{

	constructor(props) {
		super(props);
	}

	componentDidMount(){
		this.loadPlaylist();
	}

	componentWillReceiveProps( nextProps ){
		if( nextProps.params.uri != this.props.params.uri ){
			this.loadPlaylist( nextProps )
		}else if( !this.props.mopidy.connected && nextProps.mopidy.connected ){
			if( helpers.uriSource( this.props.params.uri ) == 'm3u' ){
				this.loadPlaylist( nextProps )
			}
		}
	}

	loadPlaylist( props = this.props ){
		var source = helpers.uriSource( props.params.uri );
		if( source == 'spotify' ){
			this.props.spotifyActions.getPlaylist( props.params.uri );
		}else if( source == 'm3u' && props.mopidy.connected ){
			this.props.mopidyActions.getPlaylist( props.params.uri );
		}
	}

	render(){
		var source = helpers.uriSource( this.props.params.uri );
		if( source == 'spotify' ) var playlist = this.props.spotify.playlist
		if( source == 'm3u' ) var playlist = this.props.mopidy.playlist
		if( !playlist ) return null;

		return (
			<div className="view playlist-view">
				<div className="intro">
					{ playlist.images ? <Thumbnail size="large" images={ playlist.images } /> : null }
					<div className="details">
						<div>{ playlist.tracks.total } tracks</div>
						<div>Last updated { playlist.last_modified }</div>
					</div>
				</div>
				<div className="main">
					<div className="title">
						<h1>{ playlist.name }</h1>
					</div>
					<TrackList tracks={ playlist.tracks.items } />
				</div>
			</div>
		)
	}
}


/**
 * Export our component
 *
 * We also integrate our global store, using connect()
 **/

const mapStateToProps = (state, ownProps) => {
	return state;
}

const mapDispatchToProps = (dispatch) => {
	return {
		mopidyActions: bindActionCreators(mopidyActions, dispatch),
		spotifyActions: bindActionCreators(spotifyActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist)