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
            return {...state};
        case productAction.PRODUCT_ADD_TAG:
            state.data.tags.sort((first, second) => first.id - second.id);
            const newTagId = state.data.tags[state.data.tags.length - 1].id + 1;
            state.data.tags.push({id: newTagId, text: action.payload});
            return {...state};
        case productAction.PRODUCT_OPINION_INSERTED:
            // console.log(action.payload);
            state.data.opinions.push({id: action.payload, productId: state.data.id, text: state.newOpinion});
            state.newOpinion = '';
            state.opinionInserting = false;
            // console.log(state);
            return {...state};
        case productAction.PRODUCT_REMOVE_TAG:
            const tags = state.data.tags;
            const tagIndex = tags.findIndex(tagToFind => tagToFind.id === action.payload.id);
            if (tagIndex === -1) {
                return {...state};
            }
            tags.splice(tagIndex, 1);
            return {...state, tags: tags};
        case productAction.PRODUCT_REMOVE_OPINION:
            const opinions = state.data.opinions;
            const opinionIndex = opinions.findIndex(opinionToFind => opinionToFind.id === action.payload.id)
            if (opinionIndex === -1) {
                return {...state};
            }
            opinions.splice(opinionIndex, 1);
            return {...state, opinions: opinions};
        default:
            return state
    }
};

export default productReducer
