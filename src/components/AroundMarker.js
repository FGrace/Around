import React from 'react';
import {InfoWindow, Marker} from "react-google-maps"

export class AroundMarker extends React.Component {
    state = {
        isOpen: false,
    }
    onToggleOpen = () => {
        this.setState((prevState) => {
            return {
                isOpen: !prevState.isOpen,
            }
        });
    }
    render() {
        const {location, url, user, message} = this.props.post;
        return (
            <Marker
                position={{lat:location.lat,lng:location.lon}}
                onClick={this.onToggleOpen}
            >
                {this.state.isOpen ?
                    <InfoWindow onCloseClick={this.onToggleOpen}>
                        <div>
                            <img src = {url} alt = {message} className = "around-marker-image"/>
                            <p>{`${user} : ${message}`}</p>
                        </div>
                    </InfoWindow> : null}
            </Marker>
        )

    }
}