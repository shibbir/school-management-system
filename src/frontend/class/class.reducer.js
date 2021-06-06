import Types from "./class.types";

const initialState = {
    lecture: null,
    classes: []
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case Types.GET_CLASSES_FULFILLED: {
            return { ...state, classes: action.payload.data };
        }
        case Types.GET_CLASS_FULFILLED: {
            return { ...state, lecture: action.payload.data };
        }
        case Types.POST_CLASS_FULFILLED: {
            return { ...state, classes: state.classes.concat(action.payload.data) };
        }
    }
    return state;
}
