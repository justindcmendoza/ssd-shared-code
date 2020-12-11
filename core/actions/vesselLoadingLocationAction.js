import {
	SET_VESSEL_LOADING_LOCATIONS,
	PROCESSING_VESSEL_LOADING_LOCATIONS,
	VESSEL_LOADING_LOCATIONS_ERROR,
} from "./types";
import axios from "axios";

export const getVesselLoadingLocations = (apiUri) => async (dispatch) => {
	await dispatch({
		type: PROCESSING_VESSEL_LOADING_LOCATIONS,
	});

	const API_PATH = apiUri + `/api/vessel-loading-locations`;
	await axios
		.get(API_PATH)
		.then((response) => {
			dispatch({
				type: SET_VESSEL_LOADING_LOCATIONS,
				payload: response.data,
			});
		})
		.catch((err) => {
			console.log(err);
			dispatch({
				type: VESSEL_LOADING_LOCATIONS_ERROR,
			});
		});
};
