import { combineReducers } from 'redux'
import product from './productReducer'
import basket from './basketReducer'

export default combineReducers({
    product,
    basket
})
