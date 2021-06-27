import _ from "lodash";
import Types from "./user.types";

const initialState = {
    loggedInUser: null,
    user: null,
    users: [],
    subjects: [],
    subject: null
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case Types.LOGIN_FULFILLED:
        case Types.GET_PROFILE_FULFILLED: {
            return { ...state, loggedInUser: action.payload.data };
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
        case Types.RESET_USER: {
            return { ...state, user: null };
        }
        case Types.GET_USER_SUBJECT_FULFILLED: {
            return { ...state, subject: action.payload.data };
        }
        case Types.GET_USER_SUBJECTS_FULFILLED: {
            return { ...state, subjects: action.payload.data };
        }
        case Types.LOGOUT_FULFILLED: {
            return { ...state, loggedInUser: null };
        }
    }

    return state;
}
