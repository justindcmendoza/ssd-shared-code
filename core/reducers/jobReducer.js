import {
	SET_JOBS,
	PROCESSING_JOB,
	JOB_ERROR,
	SET_USER_JOB,
} from "../actions/types";

const initialState = {
	selected: {},
	data: [],
	isLoading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_JOBS:
			return {
				...state,
				data: action.payload,
				isLoading: false,
			};

		case PROCESSING_JOB:
			return {
				...state,
				isLoading: true,
			};

		case SET_USER_JOB:
			return {
				...state,
				selected: action.payload,
				isLoading: false,
			};

		case JOB_ERROR:
			return {
				...state,
				isLoading: false,
			};

		default:
			return state;
	}
}
