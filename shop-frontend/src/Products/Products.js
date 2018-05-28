import React, { Component } from 'react';
import './Products.css';
import { withStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {Link} from "react-router-dom";
import GridListTile from "@material-ui/core/es/GridListTile/GridListTile";
import GridList from "@material-ui/core/es/GridList/GridList";
import GridListTileBar from "@material-ui/core/es/GridListTileBar/GridListTileBar";
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Search from '@material-ui/icons/Search';
import AttachMoney from "@material-ui/icons/es/AttachMoney";

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
    state = {
        selectedOption: '',
    };
    handleChange = (selectedOption) => {
        this.setState({selectedOption});
        console.log('onSelectedOption');
    };

    render() {
        const { selectedOption } = this.state;
        const products = [
            {id: 0, name: 'Produkt 1', description: 'Opis 1', price: 21.12},
            {id: 1, name: 'Produkt 2', description: 'Opis 2', price: 41.12},
            {id: 2, name: 'Produkt 3', description: 'Opis 3', price: 17.43}
        ];
        const productsList = products.map((product) => {
            return <GridListTile key={product.id}>
                    <GridListTileBar
                        title={product.name}
                        subtitle={<p><AttachMoney/> {product.price}</p>}
                        actionIcon={
                            <IconButton>
                                <li><Link to={`product/${product.id}`}> <InfoIcon/></Link></li>
                            </IconButton>
                        }
                    />
                </GridListTile>
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
                            { value: 'one', label: 'One' },
                            { value: 'two', label: 'Two' },
                        ]}
                    />
                </div>
                <GridList cellHeight={180} >
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">Lista produktów</ListSubheader>
                    </GridListTile>
                    {productsList}
                </GridList>
            </div>
        );
    }
}

export default withStyles(styles2) (Products);
