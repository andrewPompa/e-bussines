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
import {
    addOpinion,
    loadProduct,
    productAddTag,
    productRemoveOpinion,
    productRemoveTag
} from "../../store/actions/productActions";
import Button from "@material-ui/core/es/Button/Button";
import Save from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';

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
    },
    saveButton: {
        width: "100%",
        textAlign: "center"
    },
    button: {
        fontSize: 30,
        backgroundColor: "#41c300",
        margin: theme.spacing.unit
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
            key: 0,
            newTagText: '',
            tags: []
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            name: props.product.name,
            price: props.product.price,
            key: Math.random(),
            description: props.product.description,
        });
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleTagInputChange(e) {

    }

    onRemoveTagButtonClicked(tag) {
        this.props.removeTag(tag);
        this.setState({key: Math.random()});
    }

    onRemoveOpinionButtonClicked(opinion) {
        this.props.removeOpinion(opinion);
        this.setState({key: Math.random()});
    }
    onAddNewTagButtonClicked(tagText) {
        if (!tagText || tagText === '') {
            return;
        }
        this.props.addTag(tagText);
        this.setState({newTagText: '', key: Math.random()});
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
                            <Button mini variant={"fab"} className={classes.margin} onClick={e => this.onRemoveTagButtonClicked(tag)}>
                                <DeleteForeverIcon/>
                            </Button>
                        </ListItem>
                    )
                })}
                <ListItem key={'tag_new'} className={classes.listItem}>
                    <TextField
                        name={'newTagText'}
                        value={this.state.newTagText || ''}
                        onChange={e => this.handleInputChange(e)}
                        helperText="Wstaw nowy tag produktu"
                        margin="normal"
                    />
                    <Button mini variant={"fab"} className={classes.margin} onClick={() => this.onAddNewTagButtonClicked(this.state.newTagText)}>
                        <AddIcon/>
                    </Button>
                </ListItem>
            </List>

            <List subheader='Opinie' className={classes.margin}>
                {product.opinions.map(opinion => {
                    return (
                        <ListItem key={`opinion_${opinion.id}`} className={classes.listItem}>
                            <Typography variant="subheading" color="inherit">
                                {opinion.text}
                            </Typography>
                            <Button mini variant={"fab"} className={classes.margin} onClick={() => this.onRemoveOpinionButtonClicked(opinion)}>
                                <DeleteForeverIcon/>
                            </Button>
                        </ListItem>
                    )
                })}
            </List>
            <div className={classes.saveButton}>
                <Button variant={"flat"} size={"large"} className={classes.button}>
                    <Save />
                    Zapisz
                </Button>
            </div>
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
        addProduct: (product) => dispatch(addProductToBasket(product)),
        addTag: (tag) => dispatch(productAddTag(tag)),
        removeTag: (tag) => dispatch(productRemoveTag(tag)),
        removeOpinion: (opinion) => dispatch(productRemoveOpinion(opinion))
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProductManagement));