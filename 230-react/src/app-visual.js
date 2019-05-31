import React from 'react';
import ReactDOM from "react-dom";
import {Chart} from "./canvasChart";
import {apiLink, JWT} from "./index";
import {Redirect} from "react-router";
import {renderTable} from "./table";

const searchPoints = ['offence', 'age', 'year', 'area', 'gender', 'month'];

export function fetchData(selectOffence, selectFilters, visual){
    console.log(visual);
    const baseUrl = apiLink +"search?";
    const offence = 'offence='+encodeURIComponent(selectOffence.value);

    let searchPointFilter = { area: [], age: [], year: [], gender: [], month: []};

    for(let y = 0; y<selectFilters.length; y++){
        searchPointFilter[selectFilters[y].filterType].push(selectFilters[y].value);
    }

    let filterArr = [];

    for(let x = 1; x<searchPoints.length; x++){
        let resultData = searchPointFilter[searchPoints[x]];
        if(searchPointFilter[searchPoints[x]].length !== 0){
            let filter = searchPoints[x] + '=';
            for(let y = 0; y < resultData.length; y++){
                if(y !== resultData.length && y !== 0){
                    filter += ',';
                }
                filter += resultData[y];
            }
            filterArr.push(filter);
        }
    }

    let filter = '';
    for(let x = 0; x<filterArr.length; x++){
        if(x !== 0 && x !== filterArr.length){
            filter += '&';
        }
        filter += filterArr[x];
    }

    let getParam = { method: "GET" };
    let head = { Authorization: `Bearer ${JWT}` };
    getParam.headers = head;

    const url = encodeURI(baseUrl) + offence + "&" + filter;

    fetch(url,getParam)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then(function(result) {
            if(visual.value === 'table'){
                //ReactDOM.render(<div/>, document.getElementById('app-visuals'));
                renderTable(result);
            }
            else if(visual.value === 'chart') {
                let values = [];
                let resultData = result["result"];

                for(let x = 0; x < resultData.length; x++) {
                    let data = resultData[x];
                    if(Object.entries(data)[1][1] !== 0) {
                        let entry = {y: Object.entries(data)[1][1], label: Object.entries(data)[0][1]}
                        values.push(entry);
                    }
                }
                ReactDOM.render(<Chart data={values} offence={selectOffence.value}/>, document.getElementById('app-visuals'));
            }
            else if(visual === 'map'){
                document.getElementById('noVisual').style.display = 'none';
            }
        })
        .catch(function(error){
            console.log("There has been a problem with your fetch operation: ", error.message);
            //ReactDOM.render(<Redirect to={"/"}/>, document.getElementById('app-visuals'));
        });
}
