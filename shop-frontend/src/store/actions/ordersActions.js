import {API_URL} from "../../AppConstans";

export const ORDERS_LOADED = '[ORDERS] ORDERS_LOADED';

export const ordersLoaded = (orders) => ({
    type: ORDERS_LOADED,
    payload: orders
});

export const loadOrders = () => (
    (dispatch) => {
        fetch(`${API_URL}/orders`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                return undefined;
            })
            .then(orders => {
                dispatch(ordersLoaded(orders))
            });
    }
);

export const finishOrder = (orderId) => (
    (dispatch) => {
        fetch(`${API_URL}/orders/${orderId}/finish`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                return undefined;
            })
            .then(response => {
                //fixme: why in 'then' cause request is executing faster than finishing order?
                setTimeout('', 2000);
                dispatch(loadOrders())
            })
    }
);

