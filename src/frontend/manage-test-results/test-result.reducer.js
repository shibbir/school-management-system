import Types from "./test-result.types";

const initialState = {
    test_result: null,
    test_results: []
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case Types.GET_TEST_RESULTS_FULFILLED: {
            return { ...state, test_results: action.payload.data };
        }
        case Types.GET_TEST_RESULT_FULFILLED: {
            return { ...state, test_result: action.payload.data };
        }
        case Types.POST_TEST_RESULT_FULFILLED: {
            return { ...state, test_results: [action.payload.data].concat(state.test_results) };
        }
        case Types.PATCH_TEST_RESULT_FULFILLED: {
            const test_results = state.test_results.map(function(x) {
                if(x.id === action.payload.data.id) {
                    x = { ...action.payload.data };
                }
                return x;
            });
            return { ...state, test_results };
        }
        case Types.DELETE_TEST_RESULT_FULFILLED: {
            return { ...state, test_results: _.reject(state.test_results, { id: action.payload.data.id }) };
        }
        case Types.RESET_TEST_RESULT: {
            return { ...state, test_result: null };
        }
    }
    return state;
}
