export const PRODUCT_LOADING = "[PRODUCT] PRODUCT_LOADING";
export const PRODUCT_LOADED = "[PRODUCT] PRODUCT_LOADED";
export const PRODUCT_OPINION_INSERTING = "[PRODUCT] PRODUCT_OPINION_INSERTING";
export const PRODUCT_OPINION_INSERTED = "[PRODUCT] PRODUCT_OPINION_INSERTED";

export function productLoading() {
    return {type: PRODUCT_LOADING}
}

export function productLoaded(product) {
    return {
        type: PRODUCT_LOADED,
        payload: product
    }
}

export function productOpinionInserting(newOpinion) {
    return {
        type: PRODUCT_OPINION_INSERTING,
        payload: newOpinion
    }
}

export function productOpinionInserted(opinion) {
    return {
        type: PRODUCT_OPINION_INSERTED,
        payload: opinion
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

export const addOpinion = (productId, text) => (
    (dispatch) => {
        dispatch(productOpinionInserting(text));
        fetch(`http://localhost:9090/opinion/${productId}`, {
            body: JSON.stringify({'text': text}),
            cache: 'no-cache',
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return undefined;
            })
            .then(() => {
                dispatch(loadProduct(productId));
            });
    });
