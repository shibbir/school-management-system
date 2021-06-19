import { combineReducers } from "redux";

import userReducer from "../manage-users/user.reducer";
import classReducer from "../manage-classes/class.reducer";
import subjectReducer from "../manage-subjects/subject.reducer";
import testReducer from "../manage-tests/test.reducer";
import testResultReducer from "../manage-test-results/test-result.reducer";

export default combineReducers({
    userReducer,
    classReducer,
    subjectReducer,
    testReducer,
    testResultReducer
})
