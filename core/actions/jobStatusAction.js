import {
	SET_JOB_STATUSES,
	PROCESSING_JOB_STATUS,
	JOB_STATUS_ERROR,
} from "./types";
import axios from "axios";

import getEnvVars from "constants/config";
const config = getEnvVars();

export const getJobStatuses = () => async (dispatch) => {
	await dispatch({
		type: PROCESSING_JOB_STATUS,
	});

	const API_PATH = config.api.host + `/api/job-status`;
	await axios
		.get(API_PATH)
		.then(async (response) => {
			await dispatch({
				type: SET_JOB_STATUSES,
				payload: response.data,
			});
		})
		.catch((err) => {
			dispatch({
				type: JOB_STATUS_ERROR,
			});
		});
};
