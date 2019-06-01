import React, {Component} from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import chroma from 'chroma-js';
import {apiLink} from "./index";
import {fetchData} from "./app-visual";


const searchPoints = ['offence', 'age', 'year', 'area', 'gender', 'month'];

export const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const colour = chroma(data.colour);
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected ? data.colour : isFocused ? colour.alpha(0.1).css() : null,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(colour, 'white') > 2 ? 'white' : 'black'
                    : data.colour,
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? data.colour : colour.alpha(0.3).css()),
            },
        };
    },
    multiValue: (styles, { data }) => {
        const color = chroma(data.colour);
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css(),
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.colour,
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.colour,
        ':hover': {
            backgroundColor: data.colour,
            color: 'white',
        },
    }),
};

const monthOptions = [
    { value: 1, label: 'January', filterType: "month", colour: "#FFA500"},
    { value: 2, label: 'February', filterType: "month", colour: "#FFA500"},
    { value: 3, label: 'March', filterType: "month", colour: "#FFA500"},
    { value: 4, label: 'April', filterType: "month", colour: "#FFA500"},
    { value: 5, label: 'May', filterType: "month", colour: "#FFA500"},
    { value: 6, label: 'June', filterType: "month", colour: "#FFA500"},
    { value: 7, label: 'July', filterType: "month", colour: "#FFA500"},
    { value: 8, label: 'August', filterType: "month", colour: "#FFA500"},
    { value: 9, label: 'September', filterType: "month", colour: "#FFA500"},
    { value: 10, label: 'October', filterType: "month", colour: "#FFA500"},
    { value: 11, label: 'November', filterType: "month", colour: "#FFA500"},
    { value: 12, label: 'December', filterType: "month", colour: "#FFA500"},
];
const dataStyle = [
    { value: 'table', label: 'Table'},
    { value: 'chart', label: 'Chart'},
    { value: 'map', label: 'Map'}
    ];

let offenceOptions = [];
let areaOptions = [];
let yearOptions = [];
let ageOptions = [];
let genderOptions = [];

let groupedOptions = [
    {
        label: 'Area',
        options: areaOptions,
    },
    {
        label: 'Year',
        options: yearOptions,
    },
    {
        label: 'Month',
        options: monthOptions,
    },
    {
        label: 'Age',
        options: ageOptions,
    },
    {
        label: 'Gender',
        options: genderOptions,
    },
];

export function filterAdd(group, values) {
    if(group === 'offence'){
        for(let x = 0; x < values.length; x++){
            offenceOptions.push({value: values[x], label: values[x]});
        }
    }
    else if(group === 'year'){
        for(let x = 0; x < values.length; x++){
            yearOptions.push({value: values[x], label: values[x].toString(), colour: '#DC143C'});
        }
    }
    else if(group === 'age'){
        for(let x = 0; x < values.length; x++){
            ageOptions.push({value: values[x], label: values[x], colour: '#3CB371'});
        }
    }
    else if(group === 'area'){
        for(let x = 0; x < values.length; x++){
            areaOptions.push({value: values[x], label: values[x], colour: '#DA70D6'});
        }
    }
    else if(group === 'gender'){
        for(let x = 0; x < values.length; x++){
            genderOptions.push({value: values[x], label: values[x], colour: '#00BFFF'});
        }
    }
}

const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};
const groupBadgeStyles = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
};

const formatGroupLabel = data => (
    <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
);


function filterByProperty(inputValue){
    var filtered = [{
            label: 'Area',
            options: [],
        },
        {
            label: 'Year',
            options: [],
        },
        {
            label: 'Month',
            options: [],
        },
        {
            label: 'Age',
            options: [],
        },
        {
            label: 'Gender',
            options: [],
        }];
    for(let i = 0; i < groupedOptions.length; i++){
        for(let x = 0; x < groupedOptions[i].options.length; x++){
            if(groupedOptions[i].options[x].label.toLowerCase().includes(inputValue.toLowerCase())){
                let input = '{"value": "'+groupedOptions[i].options[x].value+'", ' +
                    '"label": "'+groupedOptions[i].options[x].label+'", ' +
                    '"filterType": "' + filtered[i].label.toLowerCase() + '", ' +
                    '"colour": "' + groupedOptions[i].options[x].colour + '"}';
                filtered[i].options.push(JSON.parse(input));
            }
        }
    }
    return filtered;

}

const loadFilterOptions = (inputValue, callback) => {
    setTimeout(() => {
        callback(filterByProperty(inputValue));
    }, 1000);
};

const filterOffence = (inputValue) => {
    return offenceOptions.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

const loadOffenceOptions = (inputValue, callback) => {
    setTimeout(() => {
        callback(filterOffence(inputValue));
    }, 1000);
};

function construct() {
    for (let search = 0; search < (searchPoints.length - 1); search++) {
        fetch(apiLink  + searchPoints[search] + 's')
            .then(function (response) {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(function (result) {
                let array = result[searchPoints[search] + 's'];
                filterAdd(searchPoints[search], array);
            })
            .catch(function (error) {
                console.log("There has been a problem with your fetch operation: ", error.message);
            });
    }
}

export class SelectOptions extends Component {
    constructor(props){
        super(props)
        this.state = { inputFilterValue: '', selectedFilters: [],
            inputOffenceValue: '', selectedOffence: null,
            selectedVisual: {value: 'table'}};
    }

    handleFilterInputChange = (newValue) => {
        const inputFilterValue = newValue.replace(/\W/g, '');
        this.setState({ inputFilterValue });
        return inputFilterValue;
    };
    handleFilterChange = (selectedOptions) => {
        const selectedFilters = selectedOptions;
        this.setState({selectedFilters});
        try{
            fetchData(this.state.selectedOffence, selectedFilters, this.state.selectedVisual);
        }
        catch (e) {
            console.log('Select an offence! Error: '+ e);
        }
        return selectedFilters;
    };

    handleOffenceInputChange = (newValue) => {
        const inputOffenceValue = newValue.replace(/\W/g, '');
        this.setState({ inputOffenceValue });
        return inputOffenceValue;
    };
    handleOffenceChange = (selectedOptions) => {
        const selectedOffence = selectedOptions;
        this.setState({selectedOffence});
        try {
            fetchData(selectedOffence, this.state.selectedFilters, this.state.selectedVisual);
        }
        catch (e) {
            console.log('Select an offence! Error: '+ e);
        }
        return selectedOffence;
    };

    visualChange = (selectedOption) => {
        const selectedVisual = selectedOption;
        this.setState({selectedVisual});
        try {
            fetchData(this.state.selectedOffence, this.state.selectedFilters, selectedVisual);
        }
        catch (e) {
            console.log('Select an offence! Error: ' + e);
        }
        return selectedVisual;
    };

    render(){
        if(offenceOptions.length === 0){
            console.log(offenceOptions);
            construct();
        }

        return (
            <div>
                <h2 className={"filterLabel"}>Select Visual:</h2>
                <Select
                    options={dataStyle}
                    defaultValue={dataStyle[0]}
                    onChange={this.visualChange}
                />
                <h2 className={"filterLabel"}>Select an offence:</h2>
                <AsyncSelect
                    cacheOptions
                    loadOptions={loadOffenceOptions}
                    defaultOptions
                    onInputChange={this.handleOffenceInputChange}
                    onChange={this.handleOffenceChange}
                />
                <h2 className={"filterLabel"}>Select filters: </h2>
                <AsyncSelect
                    cacheOptions
                    loadOptions={loadFilterOptions}
                    defaultOptions
                    formatGroupLabel={formatGroupLabel}
                    onInputChange={this.handleFilterInputChange}
                    onChange={this.handleFilterChange}
                    isMulti
                    styles={colourStyles}
                />
            </div>

        );
    }
}