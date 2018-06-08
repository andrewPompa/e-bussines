import {loadProduct, productLoaded, productLoading} from "./productActions";

export const ADD_PRODUCT_TO_BASKET = '[BASKET] ADD_PRODUCT_TO_BASKET';
export const REMOVE_PRODUCT_FROM_BASKET = '[BASKET] REMOVE_PRODUCT_FROM_BASKET';
export const INCREMENT_QUANTITY_OF_PRODUCT = '[BASKET] INCREMENT_QUANTITY_OF_PRODUCT';
export const DECREMENT_QUANTITY_OF_PRODUCT = '[BASKET] DECREMENT_QUANTITY_OF_PRODUCT';
export const ORDER = '[BASKET] ORDER';

export const addProductToBasket = product => ({
    type: ADD_PRODUCT_TO_BASKET,
    payload: product,
});

export const removeProductFromBasket = id => ({
    type: REMOVE_PRODUCT_FROM_BASKET,
    payload: id,
});

export const incrementQuantityOfProduct = id => ({
    type: INCREMENT_QUANTITY_OF_PRODUCT,
    payload: id,
});

export const decrementQuantityOfProduct = id => ({
    type: DECREMENT_QUANTITY_OF_PRODUCT,
    payload: id,
});

// export const orderProducts = () => ({
//     type: ORDER
// });

export const orderProducts = (basketItems) => {
    console.log(JSON.stringify(basketItems));
    return (dispatch) => {
        fetch(`http://localhost:9090/order`, {
            body: JSON.stringify(basketItems),
            cache: 'no-cache',
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow'
        })

    }};
