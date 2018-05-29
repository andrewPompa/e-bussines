const initialState = {
    id: 0,
    name: 'Produkt testowy',
    price: 21.52,
    description: 'Testowy opis',
    tags: ['ładny', 'szybki', 'czerwony'],
    opinions: ['Uwielbiam ten produkt', 'Jest najlepszy', 'Jest najgorszy'],
    newOpinion: ''
};
const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_OPINION':
            state.opinions.push(action.payload);
            console.log(state);
            return {...state};
        default:
            return state
    }
};

export default productReducer
