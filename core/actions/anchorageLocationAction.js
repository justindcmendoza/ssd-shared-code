import {
	SET_ANCHORAGE_LOCATIONS,
	PROCESSING_ANCHORAGE_LOCATIONS,
	ANCHORAGE_LOCATIONS_ERROR,
} from "./types";
import axios from "axios";

export const getAnchorages = (API_URI) => async (dispatch) => {
	await dispatch({
		type: PROCESSING_ANCHORAGE_LOCATIONS,
	});

	const API_PATH = API_URI + `/api/anchorage-locations`;
	await axios
		.get(API_PATH)
		.then(async (response) => {
			await dispatch({
				type: SET_ANCHORAGE_LOCATIONS,
				payload: response.data,
			});
		})
		.catch((err) => {
			dispatch({
				type: ANCHORAGE_LOCATIONS_ERROR,
			});
		});
};
