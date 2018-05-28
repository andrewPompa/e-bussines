import React from 'react';
import './Product.css';
import Typography from "@material-ui/core/es/Typography/Typography";
import Chip from "@material-ui/core/es/Chip/Chip";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
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
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

const Product = (props) => {
    const product = {
        id: props.match.params.id,
        name: 'Produkt testowy',
        price: 21.52,
        description: 'Testowy opis',
        tags: ['ładny', 'szybki', 'czerwony'],
        opinions: ['Uwielbiam ten produkt', 'Jest najlepszy', 'Jest najgorszy']
    };
    console.log(product.id);
    return (
        <div className="Product">
            <Typography variant="display3" color="inherit">
                {product.name}: {product.price}$
            </Typography>
            <Typography variant="display1" color="inherit">
                {product.description}
            </Typography>
            {product.tags.map(tag => {
                return (
                    <Chip
                        key={tag}
                        label={tag}
                    />
                );
            })}
            <List>
                {product.opinions.map(opinion => (
                    <ListItem key={opinion}>
                        <Avatar>
                            <WorkIcon />
                        </Avatar>
                        <ListItemText primary={opinion} />
                    </ListItem>
                ))}
            </List>
            <Button size="large">Dodaj do koszyka <AddShoppingCart color={"secondary"}/></Button>
        </div>
    );
};

export default (Product);
