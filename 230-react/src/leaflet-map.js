import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

export class SimpleExample extends Component{
    //{LGA: "Aurukun Shire Council", total: 0, lat: -13.354875, lng: 141.729058}

    constructor(props) {
        super(props);
        this.state = {
            lat: -20.090274,
            lng: 146.463862,
            zoom: 6,
            markers: [
                {position: [-20.090274, 146.463862], text: "Some cool facts about QLD, ITS FULL OF CRIME"},
                {position: [-23.090274, 146.463862], text: "Some cool facts about QLD, ITS FULL OF CRIME"},
            ],
            addressPoints: [],
        };
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        if(this.state.markers !== this.props.marker && this.props.marker){
            console.log(this.props.marker);
            this.setState({markers: this.props.marker});
        }

        if(this.props.data && this.props.data !== this.state.addressPoints){
            this.setState({addressPoints: this.props.data});
        }

        return (
            <div style={{height: '80vh', width: '100%'}}>
                <Map center={position} zoom={this.state.zoom}>
                    <HeatmapLayer
                        fitBoundsOnLoad
                        fitBoundsOnUpdate
                        points={this.state.addressPoints}
                        longitudeExtractor={m => m[1]}
                        latitudeExtractor={m => m[0]}
                        intensityExtractor={m => parseFloat(m[2])}
                        blur={50}
                        radius={80} />
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.markers.map((mark, idx) => {
                        console.log(mark);

                            return(
                                <Marker key={`marker-${idx}`} position={[mark.lat, mark.lng]}>
                                    <Popup>
                                        <span>{mark.LGA} with {mark.total} offences</span>
                                    </Popup>
                                </Marker>
                            )
                        }
                    )}
                </Map>
            </div>
        )
    }
}