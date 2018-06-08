import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import CardTravel from '@material-ui/icons/CardTravel';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Button from "@material-ui/core/es/Button/Button";
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {
    decrementQuantityOfProduct,
    incrementQuantityOfProduct, orderProducts,
    removeProductFromBasket
} from "../../store/actions/basketActions";

const styles = theme => {
    console.log(theme);
    return {
        basket: {
            width: '100%',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden'
        },
        listItem: {
            width: '100%',
            backgroundColor: theme.palette.background.default
        },
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 500,
        },
        orderButton: {
            backgroundColor: theme.palette.primary.light,
            width: "100%"
        },
        quantityInput: {
            // backgroundColor: theme.palette.primary.dark
            // width: 50,
            // textAlign: "center"
        }
    };
};

export class Basket extends React.Component {
    render() {
        const {basketItems, classes, removeProduct, incrementQuantity, decrementQuantity, orderProducts} = this.props;
        return <div className={classes.basket}>
            <List>
                {basketItems.map(basketItem => (
                    <ListItem key={basketItem.id} className={classes.listItem}>
                        <Avatar>
                            <CardTravel/>
                        </Avatar>
                        <Typography variant={"title"}>&nbsp;{basketItem.name} &nbsp;</Typography>
                        <Typography variant={"title"} className={classes.quantityInput}>
                            <Button mini variant={"fab"} onClick={() => incrementQuantity(basketItem.id)}> &nbsp;+&nbsp;</Button>
                            &nbsp;{basketItem.quantity}&nbsp;
                            <Button mini variant={"fab"} onClick={() => decrementQuantity(basketItem.id)}> &nbsp;- &nbsp;</Button>
                        </Typography>
                        <Typography variant={"title"}> &nbsp; = {basketItem.quantity * basketItem.price} &nbsp; </Typography>
                        <Button onClick={() => removeProduct(basketItem.id)} variant="fab" color={"secondary"}><HighlightOff/></Button>
                    </ListItem>
                ))}
            </List>
            <Button className={classes.orderButton} onClick={() => orderProducts(basketItems)} size="large">Zamów <FlightTakeoff color={"secondary"}/></Button>
        </div>;
    }
}




const mapStateToProps = (state) => {
    return {basketItems: state.basket};
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeProduct: (id) => dispatch(removeProductFromBasket(id)),
        incrementQuantity: (id) => dispatch(incrementQuantityOfProduct(id)),
        decrementQuantity: (id) => dispatch(decrementQuantityOfProduct(id)),
        orderProducts: (basketItems) => dispatch(orderProducts(basketItems))
    }
};
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Basket));