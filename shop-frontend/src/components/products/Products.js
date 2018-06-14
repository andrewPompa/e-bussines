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
import {getProducts, getProductsBySearchPhrase, loadSearchedPhrases} from "../../store/actions/productsActions";

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
    link: {
        color: "#FFFFFF",
        textDecoration: "none",
        padding: 16
    },
});

class Products extends Component {
    constructor(props) {
        super(props);
        props.loadProducts();
        props.loadSearchedPhrases();
    }

    state = {
        selectedOption: '',
        options: []
    };
    handleChange = (selectedOption) => {
        if (selectedOption === undefined || selectedOption === null) {
            this.setState({selectedOption: selectedOption});
            return;
        }
        console.log('onSelectedOption');
        this.setState({selectedOption: selectedOption});

        this.onInputChange(selectedOption.value);
    };
    onInputChange = (inputValue) => {
        console.log(inputValue);
        if (this.props.areProductsSearched) {
            return;
        }
        if (inputValue === '') {
            this.props.loadProducts();
            return;
        }
        this.props.searchProducts(inputValue);
    };

    componentWillReceiveProps(props) {
        console.log('component have props');
    }

    render() {
        const {selectedOption, options, loading} = this.state;
        const {products, searchedPhrases, searchedProducts} = this.props;

        if (loading === true) {
            return (<div>Loading data...</div>);
        }
        console.log(searchedPhrases);
        console.log(searchedProducts);
        const productsList = products.map((product) => {
            return (
                <Link to={`/product/${product.id}`} className={this.props.classes.link} key={product.id}>
                    <ListItem >
                        <ListItemText
                            primary={
                                <Typography variant="display1" color="inherit">
                                    {product.name}<br/><AttachMoney/>{product.price}
                                </Typography>
                            }
                            secondary={product.description}
                        />
                    </ListItem>
                </Link>
            )
        });
        return (
            <div className="Products">
                <div className='mdc-text-field'>
                    <Select
                        placeholder={<span><Search/>Wyszukaj produkt...</span>}
                        name="search-product"
                        value={selectedOption}
                        noResultsText="brak ostatnich wyszukiwań"
                        onChange={this.handleChange}
                        onInputChange={this.onInputChange}
                        options={searchedPhrases.map(phrase => ({label: phrase.text, value: phrase.text}))}
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
    return {
        products: state.products.products,
        loading: state.products.loading,
        searchedPhrases: state.products.searchedPhrases,
        areProductsSearched: state.products.productsAreSearched
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadProducts: () => dispatch(getProducts()),
        searchProducts: (phrase) => dispatch(getProductsBySearchPhrase(phrase)),
        loadSearchedPhrases: () => dispatch(loadSearchedPhrases())
    }
};

export default withStyles(styles2)(connect(mapStateToProps, mapDispatchToProps)(Products));
