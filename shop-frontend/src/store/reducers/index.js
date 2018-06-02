import { combineReducers } from 'redux'
import product from './productReducer'
import basket from './basketReducer'
import products from "./productsReducer";

export default combineReducers({
    product,
    basket,
    products
})
