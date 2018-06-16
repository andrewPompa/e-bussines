import {API_URL} from "../../AppConstans";

export const PRODUCT_LOADING = "[PRODUCT] PRODUCT_LOADING";
export const PRODUCT_LOADED = "[PRODUCT] PRODUCT_LOADED";
export const PRODUCT_ADD_TAG = "[PRODUCT] PRODUCT_ADD_TAG";
export const PRODUCT_OPINION_INSERTING = "[PRODUCT] PRODUCT_OPINION_INSERTING";
export const PRODUCT_OPINION_INSERTED = "[PRODUCT] PRODUCT_OPINION_INSERTED";
export const PRODUCT_REMOVE_TAG = "[PRODUCT] PRODUCT_REMOVE_TAG";
export const PRODUCT_REMOVE_OPINION = "[PRODUCT] PRODUCT_REMOVE_OPINION";
export const PRODUCT_SET_NAME = "[PRODUCT] PRODUCT_SET_NAME";
export const PRODUCT_SET_PRICE = "[PRODUCT] PRODUCT_SET_PRICE";
export const PRODUCT_SET_DESCRIPTION = "[PRODUCT] PRODUCT_SET_DESCRIPTION";
export const PRODUCT_ADDING = "[PRODUCT] PRODUCT_ADDING";
export const PRODUCT_ADDED = "[PRODUCT] PRODUCT_ADDED";
export const PRODUCT_UPDATING = "[PRODUCT] PRODUCT_UPDATING";
export const PRODUCT_UPDATED = "[PRODUCT] PRODUCT_UPDATED";
export const PRODUCT_RESET = "[PRODUCT] PRODUCT_RESET";
export const PRODUCT_TAG_TEXT_CHANGE = "[PRODUCT] PRODUCT_TAG_TEXT_CHANGE";

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

export function productAddTag(tag) {
    return {
        type: PRODUCT_ADD_TAG,
        payload: tag
    }
}

export function productOpinionInserted(opinion) {
    return {
        type: PRODUCT_OPINION_INSERTED,
        payload: opinion
    }
}

export function productRemoveTag(tag) {
    return {
        type: PRODUCT_REMOVE_TAG,
        payload: tag
    }
}

export function productRemoveOpinion(opinion) {
    return {
        type: PRODUCT_REMOVE_OPINION,
        payload: opinion
    }
}

export function productSetName(name) {
    return {
        type: PRODUCT_SET_NAME,
        payload: name
    }
}

export function productSetPrice(price) {
    return {
        type: PRODUCT_SET_PRICE,
        payload: price
    }
}

export function productSetDescription(description) {
    return {
        type: PRODUCT_SET_DESCRIPTION,
        payload: description
    }
}

export function productAdding() {
    return {type: PRODUCT_ADDING}
}

export function productAdded() {
    return {type: PRODUCT_ADDED}
}

export function productUpdating() {
    return {type: PRODUCT_UPDATING}
}

export function productUpdated() {
    return {type: PRODUCT_UPDATED}
}

export function resetProduct() {
    return {type: PRODUCT_RESET}
}

export function tagTextChange(tag, text) {
    return {type: PRODUCT_TAG_TEXT_CHANGE, payload: {tag: tag, text: text}}

}


export const loadProduct = (id) => (
    (dispatch) => {
        (productLoading());
        fetch(`${API_URL}/products/${id}`, {credentials: "same-origin"})
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                return undefined;
            })
            .then(products => {
                dispatch(productLoaded(products))
            });
    });

export const addOpinion = (productId, text) => (
    (dispatch) => {
        dispatch(productOpinionInserting(text));
        fetch(`${API_URL}/opinion/${productId}`, {
            body: JSON.stringify({'text': text}),
            cache: 'no-cache',
            credentials: "same-origin",
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow'
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                return undefined;
            })
            .then(() => {
                dispatch(loadProduct(productId));
            });
    });

export const addProduct = (product) => (
    (dispatch) => {
        dispatch(productAdding());
        fetch(`${API_URL}/products`, {
            body: JSON.stringify(product),
            cache: 'no-cache',
            credentials: "same-origin",
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow'
        })
            .then(() => {
                dispatch(productAdded());
            });
    }
);

export const updateProduct = (product) => (
    (dispatch) => {
        dispatch(productUpdating());
        fetch(`${API_URL}/products/`, {
            body: JSON.stringify(product),
            cache: 'no-cache',
            credentials: "same-origin",
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT',
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow'
        })
            .then(() => {
                dispatch(productUpdated());
            });
    }
);