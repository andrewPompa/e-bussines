import AddIcon from '@material-ui/icons/Add';
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import 'react-select/dist/react-select.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AttachMoney from "@material-ui/icons/es/AttachMoney";
import Typography from "@material-ui/core/es/Typography/Typography";
import Link from "react-router-dom/es/Link";
import {connect} from 'react-redux';
import {getProducts} from "../../store/actions/productsActions";
import Button from "@material-ui/core/es/Button/Button";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
});

class Products extends Component {
    constructor(props) {
        super(props);
        props.loadProducts();
    }
    state = {
        selectedOption: '',
    };
    handleChange = (selectedOption) => {
        this.setState({selectedOption});
        console.log('onSelectedOption');
    };

    render() {
        const {products, classes} = this.props;

        const productsList = products.map((product) => {
            return (
            <ListItem key={product.id}>
                <ListItemText
                    primary={
                        <Typography variant="display1" color="inherit">
                            <Link to={`/product-management/${product.id}`}>{product.name}</Link> <br/><AttachMoney/>{product.price}
                        </Typography>
                    }
                    secondary={product.description}
                />
            </ListItem>
            )});
        return (
            <div className="Products">
                <List>
                    {productsList}
                    <ListItem key="add_new_product">
                        <Button mini variant={"fab"} className={classes.margin} onClick={() => this.props.history.push('/product-management/new')}>
                            <AddIcon/>
                        </Button>
                    </ListItem>
                </List>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {products: state.products.products};
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadProducts: () => dispatch(getProducts())
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Products));
