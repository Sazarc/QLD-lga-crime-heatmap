import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

export class Leaflet extends Component{
    //{LGA: "Aurukun Shire Council", total: 0, lat: -13.354875, lng: 141.729058}

    constructor(props) {
        super(props);
        this.state = {
            lat: -20.090274,
            lng: 146.463862,
            zoom: 6,
            heatmap: <div />,
            markers: [],
            addressPoints: []
        };
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        if(this.state.markers !== this.props.marker && this.props.marker){
            this.setState({markers: this.props.marker});
        }
        if(this.props.data && this.props.data !== this.state.addressPoints && this.props.data.length > 1){
            let heatmap = <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={this.props.data}
                longitudeExtractor={m => m[1]}
                latitudeExtractor={m => m[0]}
                intensityExtractor={m => parseFloat(m[2])}
                blur={50}
                radius={80} />;
            this.setState({
                addressPoints: this.props.data,
                heatmap: heatmap
            });
        }
        if(this.props.data !== this.state.addressPoints && this.props.data.length <= 1){
            this.setState({
                addressPoints: this.props.data,
                heatmap: <div />
            });
        }

        return (
            <div style={{height: '80vh', width: '100%'}}>
                <Map center={position} zoom={this.state.zoom}>
                    {this.state.heatmap}
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.markers.map((mark, idx) => {
                        if(mark.total === 0){
                            return;
                        }
                        return(
                            <Marker key={`marker-${idx}`} position={[mark.lat, mark.lng]}>
                                <Popup>
                                    <span>{mark.LGA} with {mark.total} offences</span>
                                </Popup>
                            </Marker>
                        )
                    })}
                </Map>
            </div>
        )
    }
}