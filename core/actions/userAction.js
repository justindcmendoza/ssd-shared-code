import * as SecureStore from "expo-secure-store";
import axios from "axios";

import {
	PROCESSING_USER,
	SET_USER,
	LOGOUT_USER,
	SET_USER_ERRORS,
	REGISTER_USER,
	CLEAR_USER_ERRORS,
	SET_USERS,
} from "./types";
import { setRequestHeaderToken } from "utils/Auth";
import * as RootNavigation from "services/RootNavigation";
import getEnvVars from "constants/config";
const config = getEnvVars();

export const getUsers = (apiUri) => async (dispatch) => {
	const API_PATH = apiUri + `/api/users?checkApproval=true&isApproved=true`;

	await axios
		.get(API_PATH)
		.then((response) => {
			const users = response.data;
			dispatch({
				type: SET_USERS,
				payload: users,
			});
		})
		.catch((err) => {
			console.log(err);
			dispatch({
				type: SET_USER_ERRORS,
			});
		});
};

// Login User
export const loginUser = (userData) => async (dispatch) => {
	if (userData) {
		await dispatch({
			type: PROCESSING_USER,
		});

		const API_PATH = config.api.host + `/api/auth`;
		await axios
			.post(API_PATH, userData)
			.then((response) => {
				const { success, user, token, error } = response.data;
				if (success) {
					// Set token of request header
					SecureStore.setItemAsync("token", token);
					setRequestHeaderToken(token);

					// Set user data
					dispatch({
						type: SET_USER,
						payload: user,
					});

					const { rememberMe, email, password } = userData;
					if (rememberMe) {
						const userLogin = {
							email,
							password,
							rememberMe: rememberMe,
						};

						SecureStore.setItemAsync(
							"userLogin",
							JSON.stringify(userLogin)
						);
					} else {
						SecureStore.deleteItemAsync("userLogin");
					}
				} else {
					dispatch({
						type: SET_USER_ERRORS,
						payload: error,
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
};

// Register User
export const registerUser = (userData) => async (dispatch) => {
	if (userData) {
		await dispatch({
			type: PROCESSING_USER,
		});

		const API_PATH = config.api.host + `/api/auth/register`;
		await axios
			.post(API_PATH, userData)
			.then(async (response) => {
				const { success, error } = response.data;
				if (success) {
					await dispatch({
						type: REGISTER_USER,
					});

					RootNavigation.navigate("Login");
				} else {
					await dispatch({
						type: SET_USER_ERRORS,
						payload: error,
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
};

// Logout user
export const logoutUser = () => async (dispatch) => {
	SecureStore.deleteItemAsync("token");
	await dispatch({
		type: LOGOUT_USER,
	});
};

export const setUserData = (userData) => async (dispatch) => {
	await dispatch({
		type: SET_USER,
		payload: userData,
	});
};

export const clearErrors = () => async (dispatch) => {
	await dispatch({
		type: CLEAR_USER_ERRORS,
	});
};
