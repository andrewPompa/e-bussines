import * as productAction from '../actions/productActions'
// const initialState = {
//     id: 0,
//     name: 'Produkt testowy',
//     price: 21.52,
//     description: 'Testowy opis',
//     tags: ['ładny', 'szybki', 'czerwony'],
//     opinions: ['Uwielbiam ten produkt', 'Jest najlepszy', 'Jest najgorszy'],
//     newOpinion: ''
// };
const initialState = {
    data: {tags: [], opinions: []},
    loading: false
};
const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case productAction.PRODUCT_LOADING:
            return {...state, loading: true};
        case productAction.PRODUCT_LOADED:
            console.log(action.payload);
            return {data: action.payload, loading: false};
        default:
            return state
    }
};

export default productReducer
