import {API_URL} from "../../AppConstans";

export const USER_IS_AUTHENTICATING = "[USER] USER_IS_AUTHENTICATING";
export const USER_AUTHENTICATED = "[USER] USER_AUTHENTICATED";
export const USER_LOGOUT = "[USER] USER_LOGOUT";

export function userLoggedOut() {
    return {type: USER_LOGOUT}
}

export function userIsAuthenticating() {
    return {
        type: USER_IS_AUTHENTICATING,
    }
}

export function userAuthenticated(user) {
    return {
        type: USER_AUTHENTICATED,
        payload: user
    }
}

export const userLogout = () => (
    (dispatch) => {
        fetch(`${API_URL}/user/logout`, {credentials: "same-origin"})
            .then(dispatch(userLoggedOut()));
    });

export const userAuthenticate = () => (
    (dispatch) => {
        (userIsAuthenticating());
        fetch(`${API_URL}/user/status`, {headers: {'content-type': 'application/json', 'accept': 'application/json'}, credentials: "same-origin"})
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                return undefined;
            })
            .then(user => {
                dispatch(userAuthenticated(user))
            });
    });