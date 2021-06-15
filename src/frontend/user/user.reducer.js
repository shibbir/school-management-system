import _ from "lodash";
import Types from "./user.types";

const initialState = {
    loggedInUser: null,
    user: null,
    users: [],
    assigned_subjects: []
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
                    x = { ...action.payload.data };
                }
                return x;
            });
            return { ...state, users, user: action.payload.data };
        }
        case Types.GET_ASSIGNED_SUBJECTS_FULFILLED: {
            return { ...state, assigned_subjects: action.payload.data };
        }
    }

    return state;
}
