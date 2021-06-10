import axios from "axios";
import Types from "./class.types";

export function getClasses() {
    return {
        type: Types.GET_CLASSES,
        payload: axios({
            method: "get",
            url: "/api/classes"
        })
    };
}

export function createClass(formData) {
    return {
        type: Types.POST_CLASS,
        payload: axios({
            method: "post",
            data: formData,
            url: "/api/classes"
        })
    };
}

export function updateClass(formData, id) {
    return {
        type: Types.PATCH_CLASS,
        payload: axios({
            method: "patch",
            data: formData,
            url: `/api/classes/${id}`
        })
    };
}

export function getClass(id) {
    return {
        type: Types.GET_CLASS,
        payload: axios({
            method: "get",
            url: `/api/classes/${id}`
        })
    };
}
