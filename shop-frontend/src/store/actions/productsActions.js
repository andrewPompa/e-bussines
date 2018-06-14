import {API_URL} from "../../AppConstans";
export const PRODUCTS_LOADING = "[PRODUCTS] PRODUCTS_LOADING";
export const PRODUCTS_LOADED = "[PRODUCTS] PRODUCTS_LOADED";
export const SEARCHED_PHRASES_LOADED = "[PRODUCTS] SEARCHED_PHRASES_LOADED";
export const PRODUCTS_ARE_SEARCHED = "[PRODUCTS] PRODUCTS_ARE_SEARCHED";
export const PRODUCTS_SEARCHING_FINISHED = "[PRODUCTS] PRODUCTS_SEARCHING_FINISHED";

export function productsLoading() {
    return {type: PRODUCTS_LOADING}
}

export function productsLoaded(products) {
    return {
        type: PRODUCTS_LOADED,
        payload: products
    }
}
export function productsAreSearched() {
    return {
        type: PRODUCTS_ARE_SEARCHED,
    }
}

export function productsSearchingFinished(searchedProducts) {
    return {
        type: PRODUCTS_SEARCHING_FINISHED,
        payload: searchedProducts
    }
}

export function searchedPhrasesLoaded(searchedPhrases) {
    return {
        type: SEARCHED_PHRASES_LOADED,
        payload: searchedPhrases
    }
}

export const getProducts = () => (
    (dispatch) => {
        (productsLoading());
        fetch(`${API_URL}/products`)
            .then(response => {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                }
                return [];
            })
            .then(products => {
                dispatch(productsLoaded(products))
            });
    });

export const getProductsBySearchPhrase = (phrase) => (
    (dispatch) => {
        (productsAreSearched());
        fetch(`${API_URL}/products/search/${phrase}`)
            .then(response => {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                }
                return [];
            })
            .then(searchedProducts => {
                dispatch(productsSearchingFinished(searchedProducts))
            });
    });

export const loadSearchedPhrases = () => (
    (dispatch) => {
        fetch(`${API_URL}/phrases/searched`)
            .then(response => {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                }
                return [];
            })
            .then(searchedPhrases => {
                dispatch(searchedPhrasesLoaded(searchedPhrases))
            });
    });

