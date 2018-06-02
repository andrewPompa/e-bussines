export const PRODUCT_LOADING = "[PRODUCT] PRODUCT_LOADING";
export const PRODUCT_LOADED = "[PRODUCT] PRODUCT_LOADED";
export const PRODUCT_ADD_OPINION = "[PRODUCT] PRODUCT_ADD_OPINION";

export const addOpinion = text => ({
    type: PRODUCT_ADD_OPINION,
    payload: text,
});

export function productLoading() {
    return {type: PRODUCT_LOADING,}
}

export function productLoaded(product) {
    return {
        type: PRODUCT_LOADED,
        payload: product
    }
}

export const loadProduct = (id) => (
    (dispatch) => {
        (productLoading());
        fetch(`http://localhost:9090/products/${id}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return {};
            })
            .then(products => {
                dispatch(productLoaded(products))
            });
    });
