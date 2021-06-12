import _ from "lodash";
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
        case Types.DELETE_USER_FULFILLED: {
            return { ...state, users: _.reject(state.users, { id: action.payload.data.id }) };
        }
        case Types.POST_USER_FULFILLED: {
            return { ...state, users: [action.payload.data].concat(state.users) };
        }
        case Types.PATCH_USER_FULFILLED: {
            const users = state.users.map(function(x) {
                if(x.id === action.payload.data.id) {
                    x.forename = action.payload.data.forename;
                    x.surname = action.payload.data.surname;
                    x.username = action.payload.data.username;
                    x.updated_by = action.payload.data.updated_by;
                    x.updated_at = action.payload.data.updated_at;
                    x.modifier = action.payload.data.modifier;
                }
                return x;
            });
            return { ...state, users, user: action.payload.data };
        }
    }

    return state;
}
