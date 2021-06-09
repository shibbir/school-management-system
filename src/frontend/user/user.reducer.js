import Types from "./user.types";
import _ from "lodash";

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
        case Types.DELETE_USER_FULFILLED: {
            return { ...state, users: _.reject(state.users, { _id: action.payload.data._id }) };
        }
    }

    return state;
}
