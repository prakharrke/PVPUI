import React, { Component } from 'react';
import { Grid, GridColumn as Column , GridToolbar} from '@progress/kendo-react-grid';
import  * as sampleProducts  from '../sampleProducts';

export default class BaselineGrid extends Component{

	 state = {
        data: sampleProducts.sampleProducts.slice(0),
        editID: null
    }
       render() {
       	console.log(this.state.data)
        return (
            <Grid
                style={{ height: '420px' }}
                resizable={true}
                data={this.state.data.map((item) =>
                    Object.assign({
                        inEdit: item.ProductID === this.state.editID
                    }, item)
                )}
                editField="inEdit"

                onRowClick={this.rowClick}
                onItemChange={this.itemChange}
            >
                <GridToolbar>
                    <div onClick={this.closeEdit}>
                        <button title="Add new" className="k-button k-primary" onClick={this.addRecord} >
                            Add new
                    </button>
                    <button title="Add new" className="k-button k-primary" onClick={this.saveChanges.bind(this)} >
                            Save Changes
                    </button>
                    </div>
                </GridToolbar >
                <Column field="ProductID" title="Id" width="50px" editable={false} />
                <Column field="ProductName" title="Name" />
                <Column field="FirstOrderedOn" title="First Ordered" editor="date" format="{0:d}" />
                <Column field="UnitsInStock" title="Units" width="150px" editor="numeric" />
                <Column field="Discontinued" title="Discontinued" editor="boolean" />
            </Grid >
        );
    }

    rowClick = (e) => {
        this.setState({
            editID: e.dataItem.ProductID
        });
    };

    itemChange = (e) => {
        const data = this.state.data.slice();
        const index = data.findIndex(d => d.ProductID === e.dataItem.ProductID);
        data[index] = { ...data[index], [e.field]: e.value,edited:true };
        this.setState({
            data: data
        });
    };

    closeEdit = (e) => {
        if (e.target === e.currentTarget) {
            this.setState({ editID: null });
        }

    };

    addRecord = () => {
        const newRecord = { ProductID: this.state.data.length + 1 };
        const data = this.state.data.slice();
        data.unshift(newRecord);
        this.setState({
            data: data,
            editID: newRecord.ProductID
        });
    };

    saveChanges(event){

    	sampleProducts.sampleProducts = this.state.data
    }
}