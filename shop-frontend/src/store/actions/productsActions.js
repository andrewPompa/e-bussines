import {API_URL} from "../../AppConstans";
export const PRODUCTS_LOADING = "[PRODUCTS] PRODUCTS_LOADING";
export const PRODUCTS_LOADED = "[PRODUCTS] PRODUCTS_LOADED";

export function productsLoading() {
    return {type: PRODUCTS_LOADING,}
}

export function productsLoaded(products) {
    return {
        type: PRODUCTS_LOADED,
        payload: products
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
