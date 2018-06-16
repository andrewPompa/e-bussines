import * as ordersActions from '../actions/ordersActions';
const initialState = {
    data: [],
    ordersLoaded: false
};

const ordersReducer = (state = initialState, action) => {
    switch (action.type) {
        case ordersActions.ORDERS_LOADED:
            state.data = action.payload;
            state.ordersLoaded = true;
            console.log(state);
            return {...state};
        case ordersActions.RESET_ORDERS:
            return {...initialState};
        default:
            return state
    }
};

export default ordersReducer
