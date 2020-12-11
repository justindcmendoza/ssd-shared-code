import {
	SET_LOGISTIC_COMPANIES,
	LOGISTIC_COMPANY_ERROR,
	PROCESSING_LOGISTIC_COMPANY,
} from "./types";
import axios from "axios";

export const getLogisticCompanies = (apiUri) => async (dispatch) => {
	await dispatch({
		type: PROCESSING_LOGISTIC_COMPANY,
	});

	const API_PATH = apiUri + `/api/logistic-company`;
	await axios
		.get(API_PATH)
		.then((response) => {
			const logisticCompanies = response.data;
			logisticCompanies.unshift({
				_id: "Please Select",
				name: "Please Select",
			});

			dispatch({
				type: SET_LOGISTIC_COMPANIES,
				payload: logisticCompanies,
			});
		})
		.catch((err) => {
			console.log(err);
			dispatch({
				type: LOGISTIC_COMPANY_ERROR,
			});
		});
};
