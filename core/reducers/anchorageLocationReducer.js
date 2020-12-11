import {
	SET_ANCHORAGE_LOCATIONS,
	PROCESSING_ANCHORAGE_LOCATIONS,
	ANCHORAGE_LOCATIONS_ERROR,
} from "../actions/types";

const initialState = {
	data: {},
	anchorageLocations: [],
	errors: {},
	isLoading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_ANCHORAGE_LOCATIONS:
			return {
				...state,
				errors: {},
				anchorageLocations: action.payload,
			};

		case PROCESSING_ANCHORAGE_LOCATIONS:
			return {
				...state,
				isLoading: true,
				errors: {},
			};

		case ANCHORAGE_LOCATIONS_ERROR:
			return {
				data: {},
				isLoading: false,
				errors: {},
			};

		default:
			return state;
	}
}
