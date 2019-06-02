import React from "react";
import ReactDOM from "react-dom";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

export function renderTable(result) {
    ReactDOM.render(<TableVisual data={result.result}/>, document.getElementById('app-visuals'));
}

class TableVisual extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    render() {
        if(this.props.data !== this.state.data){
            this.setState({data: this.props.data})
        }

        return (
            <div>
                <ReactTable
                    data={this.state.data}
                    columns={[
                        {
                            Header: "Result data",
                            columns: [
                                {
                                    Header: "LGA",
                                    accessor: "LGA"
                                },
                                {
                                    Header: "Total",
                                    accessor: "total"
                                }
                            ]
                        },
                        {
                            Header: "Location",
                            columns: [
                                {
                                    Header: "Longitude",
                                    accessor: "lng"
                                },
                                {
                                    Header: "Latitude",
                                    accessor: "lat"
                                }
                            ]
                        }
                    ]}
                    defaultSorted={[
                        {
                            id: "LGA",
                            desc: false
                        }
                    ]}
                    defaultPageSize={20}
                    className="-striped -highlight"
                />
                <br />
            </div>
        );
    }
}
