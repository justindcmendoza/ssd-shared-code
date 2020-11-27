import { PROCESSING_JOB, SET_JOBS, JOB_ERROR, SET_USER_JOB } from "./types";
import axios from "axios";

import getEnvVars from "constants/config";
const config = getEnvVars();

export const getUserJobs = () => async (dispatch) => {
	await dispatch({
		type: PROCESSING_JOB,
	});

	const API_PATH = config.api.host + `/api/job`;
	await axios
		.get(API_PATH)
		.then((response) => {
			dispatch({
				type: SET_JOBS,
				payload: response.data,
			});
		})
		.catch((err) => {
			dispatch({
				type: JOB_ERROR,
			});
		});
};

export const setJobData = (job) => async (dispatch) => {
	await dispatch({
		type: SET_USER_JOB,
		payload: job,
	});
};

export const getUserJob = (jobId) => async (dispatch) => {
	await dispatch({
		type: PROCESSING_JOB,
	});

	const API_PATH = config.api.host + `/api/job/${jobId}`;
	await axios
		.get(API_PATH)
		.then(async (response) => {
			await dispatch({
				type: SET_USER_JOB,
				payload: response.data,
			});
		})
		.catch((err) => {
			dispatch({
				type: JOB_ERROR,
			});
		});
};
