import {
	SET_NOTIFICATION_TOKEN,
	PROCESSING_NOTIFICATION,
	PUSH_NOTIFICATION_ERROR,
} from "../actions/types";

const initialState = {
	selected: {},
	data: [],
	errors: {},
	isLoading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_NOTIFICATION_TOKEN:
			return {
				...state,
				notification: action.payload,
				errors: {},
				isLoading: false,
			};

		case PROCESSING_NOTIFICATION:
			return {
				...state,
				errors: {},
				isLoading: true,
			};

		case PUSH_NOTIFICATION_ERROR:
			return { ...state, errors: action.payload, isLoading: false };

		default:
			return state;
	}
}
