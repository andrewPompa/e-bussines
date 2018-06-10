import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import {getProducts} from "../../store/actions/productsActions";
import {connect} from "react-redux";

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    link: {
        color: "#FFFFFF",
        textDecoration: "none",
        padding: 16
    },
    linkButton: {
        color: "#607D8B",

    },
    linkButtonGoogle: {
        color: "#eee6ff",
        backgroundColor: "#021aee"

    },
    linkButtonGithub: {
        color: "#B0BEC5",
        backgroundColor: "#212121"
    },
    appBar: {
        backgroundColor: "#41c300"
    }
};

class Header extends Component {
    state = {
        redirectToGithubLogin: false
    };

    constructor(props) {
        super(props)
    }

    render() {
        const {classes} = this.props;

        if (this.state.redirectToGithubLogin === true) {
            window.location.replace('http//:localhost:9090/github');
        }
        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            Sklep
                        </Typography>
                        {this.showProductsButtonIfUserLogged()}
                        {this.showBasketButtonIfUserLogged()}
                        {this.showOrdersButtonIfUserIsAdmin()}
                        {this.showProductsManagementButtonIfUserIsAdmin()}
                        <Typography className={classes.flex}/>
                        {this.showLoginButtonsWhenUserIsLoggedOut()}
                        {this.showLogOutButtonWhenUserIsLoggedIn()}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }

    showProductsButtonIfUserLogged() {
        if (this.props.user.isAuthenticated === false || this.props.user.isAdmin !== false) {
            return;
        }
        return (
            <Link className={this.props.classes.link} to='/products'>
                <Button className={this.props.classes.linkButton}>
                    Produkty
                </Button>
            </Link>
        );
    }

    showBasketButtonIfUserLogged() {
        if (this.props.user.isAuthenticated === false || this.props.user.isAdmin !== false) {
            return;
        }
        return (
            <Link className={this.props.classes.link} to='/basket'>
                <Button className={this.props.classes.linkButton}>
                    Koszyk
                </Button>
            </Link>
        );
    }

    showOrdersButtonIfUserIsAdmin() {
        if (this.props.user.isAuthenticated !== true || this.props.user.isAdmin !== true) {
            return;
        }
        return (
            <Link className={this.props.classes.link} to='/sample'>
                <Button className={this.props.classes.linkButton}>
                    Zamówienia
                </Button>
            </Link>
        );
    }

    showProductsManagementButtonIfUserIsAdmin() {
        if (this.props.user.isAuthenticated !== true || this.props.user.isAdmin !== true) {
            return;
        }
        return (
            <Link className={this.props.classes.link} to='/products-management'>
                <Button className={this.props.classes.linkButton}>
                    Zarządzaj produktami
                </Button>
            </Link>
        );
    }

    showLoginButtonsWhenUserIsLoggedOut() {
        if (this.props.user.isAuthenticated !== false) {
            return;
        }
        const google =
            <Link className={this.props.classes.link} to='/sample'>
                <Button className={this.props.classes.linkButtonGoogle}>
                    Zaloguj przez Google
                </Button>
            </Link>;
        const github =
            <Link className={this.props.classes.link} to='/sample'>
                <Button className={this.props.classes.linkButtonGithub}
                        onClick={() => this.setState({redirectToGithubLogin: true})}>
                    Zaloguj przez Github
                </Button>
            </Link>;
        return (
            {google},
            {github}
        );
    }

    showLogOutButtonWhenUserIsLoggedIn() {
        if (this.props.user.isAuthenticated !== true) {
            return;
        }
        return (
            <Link className={this.props.classes.link} to='/sample'>
                <Button className={this.props.classes.linkButtonGithub}
                        onClick={() => this.setState({redirectToGithubLogin: true})}>
                    Wyloguj
                </Button>
            </Link>
        );
    }
}

const mapStateToProps = (state) => {
    return {user: state.user};
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadProducts: () => dispatch(getProducts())
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));