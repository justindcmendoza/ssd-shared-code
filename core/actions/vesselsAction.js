import { SET_VESSELS, PROCESSING_VESSELS, VESSELS_ERROR } from "./types";
import axios from "axios";

export const getVessels = (apiUri) => async (dispatch) => {
	await dispatch({
		type: PROCESSING_VESSELS,
	});

	const API_PATH = apiUri + `/api/vessels`;
	await axios
		.get(API_PATH)
		.then((response) => {
			dispatch({
				type: SET_VESSELS,
				payload: response.data,
			});
		})
		.catch((err) => {
			console.log(err);
			dispatch({
				type: VESSELS_ERROR,
			});
		});
};
