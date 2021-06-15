import Types from "./test.types";

const initialState = {
    test: null,
    tests: []
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case Types.GET_TESTS_FULFILLED: {
            return { ...state, tests: action.payload.data };
        }
        case Types.GET_TEST_FULFILLED: {
            return { ...state, test: action.payload.data };
        }
        case Types.POST_TEST_FULFILLED: {
            return { ...state, tests: [action.payload.data].concat(state.tests) };
        }
        case Types.PATCH_TEST_FULFILLED: {
            const tests = state.tests.map(function(x) {
                if(x.id === action.payload.data.id) {
                    x = { ...action.payload.data };
                }
                return x;
            });
            return { ...state, tests, test: action.payload.data };
        }
        case Types.DELETE_TEST_FULFILLED: {
            return { ...state, tests: _.reject(state.tests, { id: action.payload.data.id }) };
        }
        case Types.RESET_TEST: {
            return { ...state, test: null };
        }
    }
    return state;
}
