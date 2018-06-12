import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import 'react-select/dist/react-select.css';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {connect} from 'react-redux';
import {finishOrder, loadOrders} from "../../store/actions/ordersActions";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from "@material-ui/core/es/Button/Button";
import Save from '@material-ui/icons/Save';
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.Title,
    },
    button: {
        fontSize: 20,
        backgroundColor: "#41c300",
        width: "100%"
    }
});

class Orders extends Component {
    constructor(props) {
        super(props);
        props.loadOrders();
        this.state = {
            expanded: null,
        };
    }

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    onClickFinishOrderButton(orderId) {
        this.props.finishOrder(orderId);
    }

    render() {
        const {orders, classes} = this.props;
        const {expanded} = this.state;
        if (orders.length === 0) {
            return (<div>No orders</div>);
        }
        console.log(orders);
        return (
            <div className={classes.root}>
                {orders.map(order => {
                    return (
                        <ExpansionPanel key={order.id} expanded={expanded === `panel_${order.id}`}
                                        onChange={this.handleChange(`panel_${order.id}`)}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography className={classes.heading}>{`Zamówienie numer: ${order.id}`}</Typography>
                                <Typography
                                    className={classes.secondaryHeading}>{`Produktów: ${order.productOrders.length}, cena: ${order.sum}`}</Typography>
                            </ExpansionPanelSummary>,
                            <ExpansionPanelDetails>
                                <List>
                                    {order.productOrders.map(productOrder => {
                                        return (
                                            <ListItem key={productOrder.id}>
                                                <ListItemText
                                                    primary={`${productOrder.productName}, #${productOrder.quantity}`}
                                                    secondary={`cena: ${productOrder.price}`}/>
                                            </ListItem>
                                        );
                                    })}
                                    <ListItem key={`finishOrder_${order.id}`}>
                                        <Button variant={"flat"} size={"large"} className={classes.button} disabled={order.done} onClick={() => this.onClickFinishOrderButton(order.id)}>
                                            <PlaylistAddCheck/>{order.done ? "Zrealizowano" : "Zrealizuj"}
                                        </Button>
                                    </ListItem>
                                </List>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {orders: state.orders.data};
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadOrders: () => dispatch(loadOrders()),
        finishOrder: (orderId) => dispatch(finishOrder(orderId))
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Orders));
