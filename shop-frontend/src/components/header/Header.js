import React, { Component } from 'react';
import 'react-select/dist/react-select.css';
import AppBar from "@material-ui/core/es/AppBar/AppBar";
import Toolbar from "@material-ui/core/es/Toolbar/Toolbar";
import Typography from "@material-ui/core/es/Typography/Typography";
import { withStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/es/Button/Button";
import Link from "react-router-dom/es/Link";

const styles = {
    root: {
        flexGrow: 1,
    },
};

class Header extends Component {
    render() {
        return (
            <div className="Header">
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            Sklep&nbsp;&nbsp;&nbsp;
                        </Typography>
                        <Link to='/products'><Button>&nbsp;&nbsp;Produkty&nbsp;&nbsp;</Button></Link>
                        <Link to='/basket'><Button>&nbsp;&nbsp;Koszyk&nbsp;&nbsp;</Button></Link>
                        <Link to='/sample'><Button>&nbsp;&nbsp;Zamówienia&nbsp;&nbsp;</Button></Link>
                        <Link to='/sample'><Button>&nbsp;&nbsp;Zarządzaj produktami&nbsp;&nbsp;</Button></Link>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(Header);
