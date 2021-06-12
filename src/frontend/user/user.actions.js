import axios from "axios";
import Types from "./user.types";

export function getSignedInUserProfile() {
    return {
        type: Types.GET_PROFILE,
        payload: axios({
            method: "get",
            url: "/api/profile"
        })
    };
}

export function login(data) {
    return {
        type: Types.LOGIN,
        payload: axios({
            method: "post",
            url: "/api/login",
            data
        })
    };
}

export function getUsers(query = "") {
    return {
        type: Types.GET_USERS,
        payload: axios({
            method: "get",
            url: `/api/users${query}`
        })
    };
}

export function getUser(id) {
    return {
        type: Types.GET_USER,
        payload: axios({
            method: "get",
            url: `/api/users/${id}`
        })
    };
}

export function createUser(data) {
    return {
        type: Types.POST_USER,
        payload: axios({
            method: "post",
            url: "/api/users",
            data
        })
    };
}

export function updateUser(id, data) {
    return {
        type: Types.PATCH_USER,
        payload: axios({
            method: "patch",
            url: `/api/users/${id}`,
            data
        })
    };
}

export function deleteUser(id) {
    return {
        type: Types.DELETE_USER,
        payload: axios({
            method: "delete",
            url: `/api/users/${id}`
        })
    };
}
