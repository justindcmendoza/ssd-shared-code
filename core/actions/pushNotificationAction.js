import axios from "axios";
import {
	SET_NOTIFICATION_TOKEN,
	PROCESSING_NOTIFICATION,
	PUSH_NOTIFICATION_ERROR,
} from "./types";
import { Platform } from "react-native";
import { Notifications } from "expo";

import getEnvVars from "constants/config";
const config = getEnvVars();

// Save Expo push notification token
export const savePushNotificationToken = (user) => async (dispatch) => {
	let apiPath = config.api.host + "/api/expo-tokens";

	await dispatch({
		type: PROCESSING_NOTIFICATION,
	});

	const token = user["pushNotificationToken"];
	await axios
		.post(apiPath, { token, user })
		.then((response) => {
			if (Platform.OS === "android") {
				Notifications.createChannelAndroidAsync("default", {
					name: "default",
					sound: true,
					priority: "max",
					vibrate: [0, 250, 250, 250],
				});
			}
			dispatch({
				type: SET_NOTIFICATION_TOKEN,
				payload: response.data,
			});
		})
		.catch((err) => {
			dispatch({
				type: PUSH_NOTIFICATION_ERROR,
				payload: err.response.data.error,
			});
		});
};
