import {
	SET_JOB_STATUSES,
	PROCESSING_JOB_STATUS,
	JOB_STATUS_ERROR,
} from "../actions/types";

const initialState = {
	data: [],
	isLoading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_JOB_STATUSES:
			return {
				...state,
				data: action.payload,
				isLoading: false,
			};

		case PROCESSING_JOB_STATUS:
			return {
				...state,
				isLoading: true,
			};

		case JOB_STATUS_ERROR:
			return {
				...state,
				isLoading: false,
			};

		default:
			return state;
	}
}
