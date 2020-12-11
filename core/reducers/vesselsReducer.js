import Vessel from "../models/Vessel";
import {
	SET_VESSELS,
	PROCESSING_VESSELS,
	VESSELS_ERROR,
} from "../actions/types";

const initialState = {
	selected: new Vessel(),
	data: [],
	isLoading: false,
	errors: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_VESSELS:
			return {
				...state,
				data: action.payload,
				isLoading: false,
			};

		case PROCESSING_VESSELS:
			return {
				...state,
				isLoading: true,
			};

		case VESSELS_ERROR:
			return {
				...state,
				isLoading: false,
				errors: action.payload,
			};

		default:
			return state;
	}
}
