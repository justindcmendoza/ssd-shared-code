import {
	SET_LOGISTIC_COMPANIES,
	LOGISTIC_COMPANY_ERROR,
	PROCESSING_LOGISTIC_COMPANY,
} from "../actions/types";

const initialState = {
	selected: {},
	data: [],
	errors: {},
	isLoading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_LOGISTIC_COMPANIES:
			return {
				...state,
				data: action.payload,
				errors: {},
				isLoading: false,
			};

		case PROCESSING_LOGISTIC_COMPANY:
			return {
				...state,
				isLoading: true,
			};
		case LOGISTIC_COMPANY_ERROR:
			return {
				...state,
				errors: action.payload,
				isLoading: false,
			};

		default:
			return state;
	}
}
