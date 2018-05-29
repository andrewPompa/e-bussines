import * as basketActions from '../actions/basketActions';
const initialState = [
    {
        id: 100,
        name: 'Produkt 1',
        price: 25.87,
        quantity: 2
    },
    {
        id: 101,
        name: 'Produkt 2',
        price: 47.21,
        quantity: 1
    }
];


const basketReducer = (state = initialState, action) => {
    switch (action.type) {
        case basketActions.ADD_PRODUCT_TO_BASKET:
            console.log(action.payload);
            return [
                ...state,
                {
                    id: action.payload.id,
                    name: action.payload.name,
                    price: action.payload.price,
                    quantity: 1
                }
            ];
        case basketActions.DECREMENT_QUANTITY_OF_PRODUCT:
            const basketItemIndexToIncrement = state.findIndex(basketItem => basketItem.id === action.payload);
            if (basketItemIndexToIncrement === undefined) {
                return state;
            }
            if (state[basketItemIndexToIncrement].quantity <= 1) {
                return state;
            }
            state[basketItemIndexToIncrement].quantity -= 1;
            return [...state];

        case basketActions.INCREMENT_QUANTITY_OF_PRODUCT:
            const basketItemIndexToDecrement = state.findIndex(basketItem => basketItem.id === action.payload);
            if (basketItemIndexToDecrement === undefined) {
                return state;
            }
            state[basketItemIndexToDecrement].quantity += 1;
            return [...state];

        case basketActions.REMOVE_PRODUCT_FROM_BASKET:
            const basketItemIndexToRemove = state.findIndex(basketItem => basketItem.id === action.payload);
            if (basketItemIndexToRemove === undefined) {
                return state;
            }
            state.splice(basketItemIndexToRemove, 1);
            return [...state];
        default:
            return state
    }
};

export default basketReducer
