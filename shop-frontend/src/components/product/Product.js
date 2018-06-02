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
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {addProductToBasket} from "../../store/actions/basketActions";
import {addOpinion, loadProduct} from "../../store/actions/productActions";

const styles = theme => ({
    root: {
        width: '100%',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    listItem: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 500,
    }
});

export class Product extends React.Component {
    constructor(props) {
        super(props);
        const id = props.match.params.id;
        props.loadProduct(id);
        this.state = {
            newOpinion: ''
        };
    }

    render() {
        const {product, classes, addProduct} = this.props;
        return <div className={classes.root}>
            <Typography variant="display3" color="inherit">
                {product.name}: {product.price}$
            </Typography>
            <Typography variant="display1" color="inherit">
                {product.description}
            </Typography>
            {product.tags.map(tag => {
                return (
                    <Chip
                        key={`tag_${tag.id}`}
                        label={tag.text}
                    />
                );
            })}
            <List>
                {product.opinions.map(opinion => {
                    return <ListItem key={`opinion_${opinion.id}`} className={classes.listItem}>
                        <Avatar>
                            <WorkIcon/>
                        </Avatar>
                        <ListItemText primary={opinion.text}/>
                    </ListItem>
                })}
                <ListItem>
                    <TextField
                        key='opinion_text_field'
                        value={this.state.newOpinion}
                        onChange={e => this.updateInputValue(e)}
                        label="Napisz coś o tym produkcie"
                        placeholder="Opis produktu"
                        multiline
                        className={classes.textField}
                        margin="normal"
                    />
                    <Button onClick={() => this.onAddOpinionButtonClick()}>Wystaw opinie</Button>
                </ListItem>
            </List>
            <Button size="large" onClick={() => addProduct(product)}>Dodaj do koszyka <AddShoppingCart color={"secondary"}/></Button>
        </div>;
    }

    updateInputValue(evt) {
        this.setState({
            newOpinion: evt.target.value
        });
    }

    onAddOpinionButtonClick() {
        this.props.addNewOpinion(this.state.newOpinion);
    }
}

const mapStateToProps = (state) => {
    return {product: state.product.data};
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadProduct: (id) => dispatch(loadProduct(id)),
        addNewOpinion: (text) => dispatch(addOpinion(text)),
        addProduct: (product) => dispatch(addProductToBasket(product))
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Product));