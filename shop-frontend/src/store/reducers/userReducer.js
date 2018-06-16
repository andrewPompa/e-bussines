import * as userActions from '../actions/userActions'

const initialState = {
    user: '',
    isAdmin: false,
    isAuthenticated: false,
    isAuthenticating: false
};
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case userActions.USER_IS_AUTHENTICATING:
            return {...state, isAuthenticating: true};
        case userActions.USER_AUTHENTICATED:
            if (action.payload === undefined) {
                return {...initialState};
            }
            return {...state,
                user: action.payload.email,
                isAdmin: action.payload.isAdmin,
                isAuthenticated: true,
                isAuthenticating: false
            };
        case userActions.USER_LOGOUT:
            return {...initialState};
        default:
            return state
    }
};

export default userReducer
