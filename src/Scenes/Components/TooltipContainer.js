import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import '@progress/kendo-ui';
import { Notification, Tooltip } from '@progress/kendo-popups-react-wrapper';

export default class TooltipContainer extends React.Component {
    constructor(props) {
        super(props);
        this.content = props.content;
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12 col-sm-2 example-col">
                    <Tooltip content={this.content} />
                   
                </div>
            </div>
        );
    }
}