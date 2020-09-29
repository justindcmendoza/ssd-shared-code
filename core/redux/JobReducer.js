import Job from "../models/Job";

const initialState = {
	selected: Job,
	data: [],
	isLoading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case "SET_JOBS":
			return {
				...state,
				data: action.payload,
				isLoading: false,
			};

		default:
			return state;
	}
}
