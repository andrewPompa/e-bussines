import React, {Component} from 'react';
import './Products.css';
import {withStyles} from '@material-ui/core/styles';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Search from '@material-ui/icons/Search';
import AttachMoney from "@material-ui/icons/es/AttachMoney";
import Typography from "@material-ui/core/es/Typography/Typography";
import Link from "react-router-dom/es/Link";
import {connect} from 'react-redux';
import {getProducts} from "../../store/actions/productsActions";

const styles2 = theme => ({
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
        const {selectedOption} = this.state;
        const {products} = this.props;

        const productsList = products.map((product) => {
            return <ListItem key={product.id}>
                <ListItemText
                    primary={
                        <Typography variant="display1" color="inherit">
                            <Link to={`/product/${product.id}`}>{product.name}</Link> <br/><AttachMoney/>{product.price}
                        </Typography>
                    }
                    secondary={product.description}
                />
            </ListItem>
        });
        return (
            <div className="Products">
                <div className='mdc-text-field'>
                    <Select
                        placeholder={<span><Search/>Wyszukaj produkt...</span>}
                        name="search-product"
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={[
                            {value: 'one', label: 'One'},
                            {value: 'two', label: 'Two'},
                        ]}
                    />
                </div>
                <List>
                    {productsList}
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

export default withStyles(styles2)(connect(mapStateToProps, mapDispatchToProps)(Products));
