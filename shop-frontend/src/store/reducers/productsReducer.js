import * as productsActions from '../actions/productsActions'

// const products = [
//     {id: 0, name: 'Produkt 1', description: 'Opis 1', price: 21.12},
//     {id: 1, name: 'Produkt 2', description: 'Opis 2', price: 41.12},
//     {id: 2, name: 'Produkt 3', description: 'Opis 3', price: 17.43}
// ];

const initialState = {
    products: [],
    loading: false
};
const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case productsActions.PRODUCTS_LOADING:
            console.log(productsActions.PRODUCTS_LOADING);
            console.log(state);
            return {...state, loading: true};
        case productsActions.PRODUCTS_LOADED:
            console.log(productsActions.PRODUCTS_LOADED);
            console.log(action.payload);
            return {products: action.payload, loading: false};
        default:
            return state
    }
};

export default productsReducer
