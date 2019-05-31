import React, {Component} from "react";

var CanvasJSReact = require('./canvasjs.react');
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export class Chart extends Component{
    constructor(props){
        super(props);
        this.state = {
            animationEnabled: true,
            theme: "dark1",
            title:{
                text: ""
            },
            axisX: {
                title: "LGA",
                labelFontSize: 12,
            },
            axisY: {
                title: "Number of offences",
                labelFontSize: 12,
                scaleBreaks: {
                    autoCalculate: true,
                    type: "wavy",
                    lineColor: "white",
                    maxNumberOfAutoBreaks: 3,
                    collapsibleThreshold: "15%"
                }
            },
            data: [{
                type: "column",
                dataPoints: []
            }],
            height: 800
        };
        this.state.data[0].dataPoints = props.data;
        this.state.title.text = props.offence;
    }

    render(){
        if(this.props.data !== this.state.data[0].dataPoints){
            this.setState({data: [{type: "column", dataPoints: this.props.data}],
                                 title: {text: this.props.offence}});
        }
        return (
            <div id={"chart"}>
                <CanvasJSChart options = {this.state}
                               onRef = {ref => this.chart = ref}
                />
            </div>
        );
    }
}