import axios from "axios";
import Types from "./test-result.types";

export function getTestResultsByTest(test_id) {
    return {
        type: Types.GET_TEST_RESULTS,
        payload: axios({
            method: "get",
            url: `/api/tests/${test_id}/test-results`
        })
    };
}

export function createTestResult(test_id, test_result) {
    return {
        type: Types.POST_TEST_RESULT,
        payload: axios({
            method: "post",
            url: `/api/tests/${test_id}/test-results`,
            data: test_result
        })
    };
}

export function getTestResult(test_result_id) {
    return {
        type: Types.GET_TEST_RESULT,
        payload: axios({
            method: "get",
            url: `/api/test-results/${test_result_id}`
        })
    };
}

export function updateTestResult(test_result_id, test_result) {
    return {
        type: Types.PATCH_TEST_RESULT,
        payload: axios({
            method: "patch",
            url: `/api/test-results/${test_result_id}`,
            data: test_result
        })
    };
}

export function importTestResults(test_id, form_data) {
    return {
        type: Types.IMPORT_TEST_RESULTS,
        payload: axios({
            method: "post",
            url: `/api/tests/${test_id}/import-test-results`,
            data: form_data
        })
    };
}

export function deleteTestResult(id) {
    return {
        type: Types.DELETE_TEST_RESULT,
        payload: axios({
            method: "delete",
            url: `/api/test-results/${id}`
        })
    };
}

export function resetTestResult() {
    return {
        type: Types.RESET_TEST_RESULT
    };
}
