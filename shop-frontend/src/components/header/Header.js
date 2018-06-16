import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import {Link, withRouter} from "react-router-dom";
import {getProducts, resetProducts} from "../../store/actions/productsActions";
import {connect} from "react-redux";
import {resetProduct} from "../../store/actions/productActions";
import {userAuthenticate, userLogout} from "../../store/actions/userActions";
import {resetOrders} from "../../store/actions/ordersActions";
import {resetBasket} from "../../store/actions/basketActions";
import {GOOGLE_URL, GITHUB_URL} from "../../AppConstans";

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
        redirectToGithubLogin: false,
        redirectToGoogleLogin: false,
        key: Math.random()
    };

    constructor(props) {
        super(props);
        this.props.userAuthenticate();
    }

    render() {
        const {classes} = this.props;

        if (this.props.user.isAuthenticating === true) {
            return (<div>User is logging...</div>);
        }
        if (this.state.redirectToGithubLogin === true) {
            this.props.history.push('/login/github');
            return (<div>Redirecting to login page...</div>);
        }
        if (this.state.redirectToGoogleLogin === true) {
            this.props.history.push('/login/google');
            return (<div>Redirecting to login page...</div>);
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
                        {this.showGoogleLoginButtonsWhenUserIsLoggedOut()}
                        {this.showGithubLoginButtonsWhenUserIsLoggedOut()}
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
            <Link className={this.props.classes.link} to='/orders'>
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

    showGoogleLoginButtonsWhenUserIsLoggedOut() {
        console.log(this.props.user);
        if (this.props.user.isAuthenticated !== false) {
            return;
        }
        console.log('showing loggin button');

        return (
            <a href={`${GOOGLE_URL}`}>Google</a>
        );
    }

    showGithubLoginButtonsWhenUserIsLoggedOut() {
        console.log(this.props.user);
        if (this.props.user.isAuthenticated !== false) {
            return;
        }
        console.log('showing loggin button');

        return (
            <Link className={this.props.classes.link} to='/sample'>
                <Button className={this.props.classes.linkButtonGithub}
                        onClick={() => this.setState({redirectToGithubLogin: true})}>
                    Zaloguj przez Github
                </Button>
            </Link>
        );
    }

    resetStateAndRedirectToRootPath() {
        this.props.resetProduct();
        this.props.resetProducts();
        this.props.resetBasket();
        this.props.resetOrders();
        this.props.logoutUser();
        this.setState({key: Math.random()});
    }

    showLogOutButtonWhenUserIsLoggedIn() {
        if (this.props.user.isAuthenticated !== true) {
            return;
        }
        return (
            <Link className={this.props.classes.link} to='/'>
                <Button className={this.props.classes.linkButtonGithub}
                        onClick={() => this.resetStateAndRedirectToRootPath()}>
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
        userAuthenticate: () => dispatch(userAuthenticate()),
        loadProducts: () => dispatch(getProducts()),
        resetProducts: () => dispatch(resetProducts()),
        resetBasket: () => dispatch(resetBasket()),
        resetOrders: () => dispatch(resetOrders()),
        resetProduct: () => dispatch(resetProduct()),
        logoutUser: () => dispatch(userLogout())
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRouter(Header)));