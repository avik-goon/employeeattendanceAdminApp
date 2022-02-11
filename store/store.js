import { applyMiddleware, compose, combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import ReduxThunk from "redux-thunk";
import CreateUserDetails from "./reducers/CreateUserDetails";
import CreateAdminData from "./reducers/CreateAdminData";
import EmployeeLists from "./reducers/EmployeeLists";
import { composeWithDevTools } from 'redux-devtools-extension';
import leaveRecordCounter from "./reducers/leaveRecordCounter";
import leaveRecordsData from '../store/reducers/leaveRecords';
const composeEnhancers = composeWithDevTools({
  trace: true
});
const rootReducer = combineReducers({
  loggedInUser: CreateUserDetails,
  admin: CreateAdminData,
  employeeState: EmployeeLists,
  leaveRecordCounter: leaveRecordCounter,
  leaveRecordsData: leaveRecordsData
});

const store = configureStore({ reducer: rootReducer })
export default store;
//composeEnhancers(
  //  applyMiddleware(ReduxThunk)
//)