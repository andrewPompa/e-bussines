import * as opinionsActions from '../actions/ordersActions';
const initialState = {
    data: [],
    ordersLoaded: false
};

const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case opinionsActions.ORDERS_LOADED:
            state.data = action.payload;
            state.ordersLoaded = true;
            console.log(state);
            return {...state};
        default:
            return state
    }
};

export default ordersReducer
