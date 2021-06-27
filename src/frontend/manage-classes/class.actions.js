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

export function createClass(data) {
    return {
        type: Types.POST_CLASS,
        payload: axios({
            method: "post",
            data,
            url: "/api/classes"
        })
    };
}

export function updateClass(id, data) {
    return {
        type: Types.PATCH_CLASS,
        payload: axios({
            method: "patch",
            data,
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

export function deleteClass(id) {
    return {
        type: Types.DELETE_CLASS,
        payload: axios({
            method: "delete",
            url: `/api/classes/${id}`
        })
    };
}

export function getSubjectsByClass(class_id) {
    return {
        type: Types.GET_CLASS_SUBJECTS,
        payload: axios({
            method: "get",
            url: `/api/classes/${class_id}/subjects`
        })
    };
}

export function bulkEnrolment(id, data) {
    return {
        type: Types.PATCH_PUPILS_ENROLMENT,
        payload: axios({
            method: "patch",
            data,
            url: `/api/classes/${id}/bulk-enrolment`
        })
    };
}

export function bulkSubjectsSelection(id, data) {
    return {
        type: Types.BULK_SUBJECTS_SELECTION,
        payload: axios({
            method: "put",
            data,
            url: `/api/classes/${id}/bulk-subjects-selection`
        })
    };
}

export function resetClass() {
    return {
        type: Types.RESET_CLASS
    };
}
