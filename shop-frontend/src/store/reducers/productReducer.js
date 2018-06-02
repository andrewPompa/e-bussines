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
    loading: false,
    newOpinion: '',
    opinionInserting: false
};
const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case productAction.PRODUCT_LOADING:
            return {...state, loading: true};
        case productAction.PRODUCT_LOADED:
            // console.log(action.payload);
            return {data: action.payload, loading: false};
        case productAction.PRODUCT_OPINION_INSERTING:
            state.newOpinion = action.payload;
            state.opinionInserting = true;
            // console.log(state);
            return {...state};
        case productAction.PRODUCT_OPINION_INSERTED:
            // console.log(action.payload);
            state.data.opinions.push({id: action.payload, productId: state.data.id, text: state.newOpinion});
            state.newOpinion = '';
            state.opinionInserting = false;
            // console.log(state);
            return {...state};
        default:
            return state
    }
};

export default productReducer
