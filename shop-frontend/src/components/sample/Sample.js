import React, { Component } from 'react';
import './Sample.css';
import Button from "@material-ui/core/es/Button/Button";

class Sample extends Component {
    render() {
        return (
            <div className="Sample">
                <p className="Sample-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <Button variant='raised' color='primary'>
                    Hello :)
                </Button>
            </div>
        );
    }
}

export default Sample;
