import { combineReducers } from 'redux'
import product from './productReducer'
import basket from './basketReducer'
import products from "./productsReducer";
import user from "./userReducer";
import orders from "./ordersReducer";

export default combineReducers({
    product,
    basket,
    products,
    user,
    orders
})
