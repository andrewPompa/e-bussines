import React from 'react';
import Typography from "@material-ui/core/Typography/Typography";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    addOpinion, addProduct,
    loadProduct,
    productAddTag,
    productRemoveOpinion,
    productRemoveTag,
    productSetDescription,
    productSetName,
    productSetPrice, resetProduct, tagTextChange, updateProduct
} from "../../store/actions/productActions";
import Button from "@material-ui/core/Button";
import Save from '@material-ui/icons/Save';
import {Redirect} from "react-router-dom";

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
        marginLeft: theme.spacing.unit
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
        this.state = {
            key: 0,
            newTagText: '',
            formValid: false,
            isNew: true
        };
        if (id !== 'new') {
            this.state.isNew = false;
            props.loadProduct(id);
        }
        this.state.formValid = this.isFormValid();
    }

    componentWillReceiveProps(props) {
        this.checkFormValidity();
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    setName(e) {
        this.props.setName(e.target.value);
        this.setState({key: Math.random()});
        this.checkFormValidity();
    }

    setPrice(e) {
        this.props.setPrice(e.target.value);
        this.setState({key: Math.random()});
        this.checkFormValidity();
    }

    setDescription(e) {
        this.props.setDescription(e.target.value);
        this.setState({key: Math.random()});
        this.checkFormValidity();
    }

    checkFormValidity() {
        this.setState({formValid: this.isFormValid()});
    }

    isFormValid() {
        const isProductSet = this.props.product !== undefined;
        if (!isProductSet) {
            return false;
        }
        const isNameSet = this.props.product.name && this.props.product.name !== '';
        const isPriceSet = this.props.product.price && this.props.product.price !== '';
        const isDescriptionSet = this.props.product.description && this.props.product.description !== '';
        return (isNameSet && isPriceSet && isDescriptionSet);
    }

    onRemoveTagButtonClicked(tag) {
        this.props.removeTag(tag);
        this.setState({key: Math.random()});
    }

    onRemoveOpinionButtonClicked(opinion) {
        this.props.removeOpinion(opinion);
        this.setState({key: Math.random()});
    }

    onTagChange(e, tag) {
        this.props.tagTextChange(tag, e.target.value);
        this.setState({key: Math.random()});
    }

    onAddNewTagButtonClicked(tagText) {
        if (!tagText || tagText === '') {
            return;
        }
        this.props.addTag(tagText);
        this.setState({newTagText: '', key: Math.random()});
    }
    onClickSaveButton() {
        console.log('saving');
        this.setState({formValid: false});
        if (this.state.isNew === true) {
            this.props.addProduct(this.props.product);
        } else {
            this.props.updateProduct();
        }
    }

    render() {
        const {product, classes, isAdded, isUpdated, resetProduct, tagTextChange} = this.props;
        if (product === undefined || !product) {
            return <Typography variant="subheading" color="inherit">
                Product does not exists
            </Typography>;
        }
        if (isUpdated === true || isAdded === true) {
            resetProduct();
            return <Redirect to="/products-management"/>;
        }
        this.state.formValid = this.isFormValid();
        return <form className={classes.root}>
            <TextField
                className={classes.margin}
                name="name"
                label="Nazwa"
                value={product.name || ''}
                onChange={e => this.setName(e)}
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
                value={product.price || ''}
                onChange={e => this.setPrice(e)}
                InputLabelProps={{
                    shrink: true,
                }}
                type={'number'}
                helperText="Wstaw cenę produktu"
                margin="normal"
            />
            <TextField
                className={classes.textField}
                name="description"
                label="Opis"
                value={product.description || ''}
                onChange={e => this.setDescription(e)}
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
                                onChange={e => this.onTagChange(e, tag)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                            <Button mini variant={"fab"} className={classes.margin}
                                    onClick={e => this.onRemoveTagButtonClicked(tag)}>
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
                    <Button mini variant={"fab"} className={classes.margin}
                            onClick={() => this.onAddNewTagButtonClicked(this.state.newTagText)}>
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
                            <Button mini variant={"fab"} className={classes.margin}
                                    onClick={() => this.onRemoveOpinionButtonClicked(opinion)}>
                                <DeleteForeverIcon/>
                            </Button>
                        </ListItem>
                    )
                })}
            </List>
            <div className={classes.saveButton}>
                <Button variant={"flat"} size={"large"} className={classes.button} disabled={!this.state.formValid} onClick={() => this.onClickSaveButton()}>
                    <Save/>Zapisz
                </Button>
            </div>
        </form>;
    }
}

const mapStateToProps = (state) => {
    return {
        product: state.product.data,
        isUpdated: state.product.isUpdated,
        isAdded: state.product.isAdded
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setName: (name) => dispatch(productSetName(name)),
        setPrice: (price) => dispatch(productSetPrice(price)),
        setDescription: (description) => dispatch(productSetDescription(description)),
        loadProduct: (id) => dispatch(loadProduct(id)),
        addNewOpinion: (id, text) => dispatch(addOpinion(id, text)),
        addTag: (tag) => dispatch(productAddTag(tag)),
        removeTag: (tag) => dispatch(productRemoveTag(tag)),
        removeOpinion: (opinion) => dispatch(productRemoveOpinion(opinion)),
        updateProduct: () => dispatch(updateProduct()),
        addProduct: (product) => dispatch(addProduct(product)),
        resetProduct: () => dispatch(resetProduct()),
        tagTextChange: (tag, text) => dispatch(tagTextChange(tag, text))
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProductManagement));