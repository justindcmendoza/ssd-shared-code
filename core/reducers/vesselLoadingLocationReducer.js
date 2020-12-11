import Vessel from "../models/Vessel";
import {
	SET_VESSEL_LOADING_LOCATIONS,
	PROCESSING_VESSEL_LOADING_LOCATIONS,
	VESSEL_LOADING_LOCATIONS_ERROR,
} from "../actions/types";

const initialState = {
	data: [],
	isLoading: false,
	errors: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_VESSEL_LOADING_LOCATIONS:
			return {
				...state,
				data: action.payload,
				isLoading: false,
			};

		case PROCESSING_VESSEL_LOADING_LOCATIONS:
			return {
				...state,
				isLoading: true,
			};

		case VESSEL_LOADING_LOCATIONS_ERROR:
			return {
				...state,
				isLoading: false,
				errors: action.payload,
			};

		default:
			return state;
	}
}
