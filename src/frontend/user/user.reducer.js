import Types from "./user.types";

const initialState = {
    loggedInUser: null,
    user: null,
    users: []
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case Types.LOGIN_FULFILLED:
        case Types.GET_PROFILE_FULFILLED: {
            return {
                ...state,
                loggedInUser: action.payload.data
            };
        }
        case Types.GET_USER_FULFILLED: {
            return { ...state, user: action.payload.data };
        }
        case Types.GET_USERS_FULFILLED: {
            return { ...state, users: action.payload.data };
        }
    }
    return state;
}
