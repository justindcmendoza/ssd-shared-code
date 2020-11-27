import { combineReducers } from "redux";
import userReducer from "./userReducer";
import pushNotificationReducer from "./pushNotificationReducer";
import jobReducer from "./jobReducer";
import jobStatusReducer from "./jobStatusReducer";
import vesselsReducer from "./vesselsReducer";
import logisticCompanyReducer from "./logisticCompanyReducer";
import vesselLoadingLocationReducer from "./vesselLoadingLocationReducer";
import anchorageLocationReducer from "./anchorageLocationReducer";

export default combineReducers({
	user: userReducer,
	pushNotification: pushNotificationReducer,
	job: jobReducer,
	jobStatus: jobStatusReducer,
	vessels: vesselsReducer,
	logisticCompany: logisticCompanyReducer,
	vesselLoadingLocation: vesselLoadingLocationReducer,
	anchorageLocation: anchorageLocationReducer,
});
