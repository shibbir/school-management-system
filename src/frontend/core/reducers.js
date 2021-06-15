import { combineReducers } from "redux";

import userReducer from "../user/user.reducer";
import classReducer from "../class/class.reducer";
import subjectReducer from "../subject/subject.reducer";
import testReducer from "../manage-tests/test.reducer";

export default combineReducers({
    userReducer,
    classReducer,
    subjectReducer,
    testReducer
})
