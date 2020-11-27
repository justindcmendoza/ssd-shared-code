import {
	SET_USER,
	PROCESSING_USER,
	LOGOUT_USER,
	LOGIN_FAILED,
	SET_USER_ERRORS,
	REGISTER_USER,
	CLEAR_USER_ERRORS,
	SET_USERS,
} from "../actions/types";

const initialState = {
	isAuthenticated: false,
	isLoading: false,
	data: {},
	users: [],
	errors: {},
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return {
				...state,
				isAuthenticated: true,
				isLoading: false,
				errors: {},
				data: action.payload,
			};

		case SET_USERS:
			return {
				...state,
				isLoading: false,
				errors: {},
				users: action.payload,
			};

		case PROCESSING_USER:
			return {
				...state,
				isLoading: true,
				errors: {},
			};

		case SET_USER_ERRORS: {
			return {
				...state,
				isLoading: false,
				isAuthenticated: false,
				errors: action.payload,
			};
		}

		case CLEAR_USER_ERRORS:
			return {
				...state,
				isLoading: false,
				errors: {},
			};

		case REGISTER_USER:
		case LOGOUT_USER:
		case LOGIN_FAILED:
			return {
				data: {},
				isLoading: false,
				isAuthenticated: false,
				errors: {},
			};

		default:
			return state;
	}
}
