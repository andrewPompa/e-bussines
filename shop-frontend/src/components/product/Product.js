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
import {addOpinion} from "../../store/actions";

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
        console.log(props);
        this.state = {
            newOpinion: ''
        };
    }

    render() {
        const {product, classes} = this.props;

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
                        key={tag}
                        label={tag}
                    />
                );
            })}
            <List>
                {product.opinions.map(opinion => (
                    <ListItem key={opinion} className={classes.listItem}>
                        <Avatar>
                            <WorkIcon/>
                        </Avatar>
                        <ListItemText primary={opinion}/>
                    </ListItem>
                ))}
                <ListItem>
                    <TextField
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
            <Button size="large">Dodaj do koszyka <AddShoppingCart color={"secondary"}/></Button>
        </div>;
    }

    updateInputValue(evt) {
        this.setState({
            newOpinion: evt.target.value
        });
    }

    onAddOpinionButtonClick() {
        console.log('sss');
        this.props.addNewOpinion(this.state.newOpinion);
    }
}

const mapStateToProps = (state) => {
    return {product: state.product};
};

const mapDispatchToProps = (dispatch) => {
    return {
        addNewOpinion: (text) => dispatch(addOpinion(text))
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Product));