import React from 'react';
import Typography from "@material-ui/core/es/Typography/Typography";
import Chip from "@material-ui/core/es/Chip/Chip";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {addProductToBasket} from "../../store/actions/basketActions";
import {addOpinion, loadProduct} from "../../store/actions/productActions";
import Button from "@material-ui/core/es/Button/Button";

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
    },
    margin: {
        margin: theme.spacing.unit,
    }
});

export class ProductManagement extends React.Component {
    constructor(props) {
        super(props);
        const id = props.match.params.id;
        props.loadProduct(id);
        this.state = {
            name: '',
            price: 0.0,
            tags: []
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            name: props.product.name,
            price: props.product.price,
            description: props.product.description,
            tags: props.product.tags
        });
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleTagInputChange(e) {

    }

    render() {
        const {product, classes} = this.props;
        if (product === undefined) {
            return '<div>Cannot load content</div>'
        }
        return <form className={classes.root}>
            <TextField
                className={classes.margin}
                name="name"
                label="Nazwa"
                value={this.state.name}
                onChange={e => this.handleInputChange(e)}
                InputLabelProps={{
                    shrink: true,
                }}
                helperText="Wstaw nazwę produktu"
                margin="normal"
            />
            <TextField
                className={classes.margin}
                name="price"
                label="Cena"
                value={this.state.price}
                onChange={e => this.handleInputChange(e)}
                InputLabelProps={{
                    shrink: true,
                }}
                type={'number'}
                helperText="Wstaw cenę produktu"
                margin="normal"
            />
            <TextField
                className={classes.margin}
                name="description"
                label="Opis"
                value={this.state.description}
                onChange={e => this.handleInputChange(e)}
                InputLabelProps={{
                    shrink: true,
                }}
                multiline
                helperText="Wstaw opis produktu"
                fullWidth
                margin="normal"
            />
            <List subheader='Tagi' className={classes.margin}>
                {product.tags.map(tag => {
                    return (
                        <ListItem key={`tag_${tag.id}`} className={classes.listItem}>
                            <TextField
                                name={`tag_${tag.id}`}
                                value={tag.text}
                                onChange={e => this.handleTagInputChange(e)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                            <Button mini variant={"fab"} className={classes.margin}><DeleteForeverIcon/></Button>
                        </ListItem>
                    )
                })}
                <ListItem key={'tag_new'} className={classes.listItem}>
                    <TextField
                        name={'tag_name'}
                        helperText="Wstaw nowy tag produktu"
                        margin="normal"
                    />
                    <Button mini variant={"fab"} className={classes.margin}><AddIcon/></Button>
                </ListItem>
            </List>

            <List subheader='Opinie' className={classes.margin}>
                {product.opinions.map(opinion => {
                    return (
                        <ListItem key={`opinion_${opinion.id}`} className={classes.listItem}>
                            <Typography variant="subheading" color="inherit">
                                {opinion.text}
                            </Typography>
                            <Button mini variant={"fab"} className={classes.margin}><DeleteForeverIcon/></Button>
                        </ListItem>
                    )
                })}
            </List>
        </form>;
    }
}

const mapStateToProps = (state) => {
    return {product: state.product.data};
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadProduct: (id) => dispatch(loadProduct(id)),
        addNewOpinion: (id, text) => dispatch(addOpinion(id, text)),
        addProduct: (product) => dispatch(addProductToBasket(product))
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProductManagement));