import moment from "moment";
import {
	filterItems,
	filterCareOffs,
	filterNonVesselDelivery,
} from "../utils/JobHelpers";

const validateJobCreation = async (job, user, apiUri, edit) => {
	// Check if any service has been selected.
	if (!job.makeTruckBooking && !job.makeLighterBooking) {
		return {
			valid: false,
			message: "Please select a service you would like us to provide",
		};
	}

	// Check if there are conflicting pickup Jobs
	if (job.pickupDetails.length >= 0) {
		let pickupDetails = job.pickupDetails;
		pickupDetails.sort((a, b) => {
			return new Date(a.pickupDateTime) - new Date(b.pickupDateTime);
		});
		job.pickupDetails = pickupDetails;

		for (let i = 0; i < pickupDetails.length - 1; i++) {
			let pickupDetailA = pickupDetails[i];
			let pickupDetailB = pickupDetails[i + 1];
			if (
				moment(pickupDetailB.pickupDateTime).isBefore(
					moment(pickupDetailA.pickupDateTime).add(5, "minutes")
				)
			) {
				return {
					valid: false,
					message:
						"Pickup Date & Time must be at least 5 minutes apart",
				};
			}
		}
		for (let i = 0; i < pickupDetails.length; i++) {
			let pickupDetail = pickupDetails[i];
			if (
				(!edit &&
					moment(pickupDetail.pickupDateTime).isBefore(moment())) ||
				(edit &&
					moment(pickupDetail.pickupDateTime).isBefore(
						job.job.jobBookingDateTime
					))
			) {
				return {
					valid: false,
					message:
						"Pickup Date & Time must be after Job creation time",
				};
			}
			if (
				job.vesselLoadingLocation.type !== "port" &&
				moment(pickupDetail.pickupDateTime).isAfter(
					moment(job.vesselLoadingDateTime)
				)
			) {
				return {
					valid: false,
					message:
						"Pickup Date & Time must be before Job delivery time",
				};
			}
		}
	}

	// Check if there are conflicting offland Jobs
	if (job.offlandDetails.length >= 0) {
		let offlandDetails = job.offlandDetails;
		offlandDetails.sort((a, b) => {
			return new Date(a.offlandDateTime) - new Date(b.offlandDateTime);
		});
		job.offlandDetails = offlandDetails;

		for (let i = 0; i < offlandDetails.length - 1; i++) {
			let offlandDetailA = offlandDetails[i];
			let offlandDetailB = offlandDetails[i + 1];
			if (
				moment(offlandDetailB.offlandDateTime).isBefore(
					moment(offlandDetailA.offlandDateTime).add(5, "minutes")
				)
			) {
				return {
					valid: false,
					message:
						"Offland Date & Time must be at least 5 minutes apart",
				};
			}
		}
		for (let i = 0; i < offlandDetails.length; i++) {
			let offlandDetail = offlandDetails[i];
			if (
				(!edit &&
					moment(offlandDetail.offlandDateTime).isBefore(moment())) ||
				(edit &&
					moment(offlandDetail.offlandDateTime).isBefore(
						job.job.jobBookingDateTime
					))
			) {
				return {
					valid: false,
					message:
						"Offland Date & Time must be after Job creation time",
				};
			}
		}
	}

	if (
		job.vesselIMOID === "" &&
		job.vesselCallsign === "" &&
		job.vesselLoadingLocation.type !== "others"
	) {
		const queryVesselName = job.vesselName;

		try {
			const res = await axios.get(
				`${apiUri}/api/vessels/search?query=${queryVesselName}`
			);
			const result = res.data;
			if (result.length === 1) {
				job.vesselIMOID = result[0].vesselIMOID
					? result[0].vesselIMOID
					: "";
				job.result[0] ? result[0].vesselName : "";
				job.result[0] ? result[0].vesselCallsign : "";
			} else if (result.length > 1) {
				job.vesselQueryResults = result;
			} else {
				return {
					valid: false,
					message: `There is no such Vessel with Name: ${queryVesselName}`,
				};
			}
		} catch (err) {
			console.log(err);
		}
	}

	const filteredItems = filterItems(job.jobItems);
	const filteredJobOfflandItems = filterItems(job.jobOfflandItems);

	const nonVesselDelivery = filterNonVesselDelivery(
		job.vesselLoadingLocation.type,
		job.otherVesselLoadingLocation
	);
	job.vesselLoadingLocation = nonVesselDelivery.vesselLoadingLocation;

	if (job.vesselName === "" && !nonVesselDelivery.keyWordExists) {
		return {
			valid: false,
			message: "Vessel Name must be filled",
		};
	} else if (
		!nonVesselDelivery.keyWordExists &&
		job.vesselIMOID.trim() === ""
	) {
		return {
			valid: false,
			message: "Please select a vessel!",
		};
	} else if (job.vesselLoadingDateTime === "") {
		return {
			valid: false,
			message: "Vessel Loading Date and Time must be filled",
		};
	} else if (filteredItems.length < 1 && filteredJobOfflandItems.length < 1) {
		return {
			valid: false,
			message:
				"At least one item must be submitted for delivery or offlanding!",
		};
	} else if (job.makeLighterBooking && !job.vesselArrivalDateTime) {
		return {
			valid: false,
			message: "Please provide a valid Vessel ETA",
		};
	} else if (
		job.vesselLoadingLocation.type === "others" &&
		job.otherVesselLoadingLocation.trim() === ""
	) {
		return {
			valid: false,
			message: "Vessel Loading Location must be filled",
		};
	} else if (user.userType === "Admin" && job.user._id === "Please Select") {
		return {
			valid: false,
			message: "A user must be selected",
		};
	} else if (
		filteredJobOfflandItems.length > 0 &&
		(job.offlandDetails.length === 0 ||
			(job.offlandDetails.length === 1 &&
				job.offlandDetails[0].offlandLocation.addressString.trim() ===
					""))
	) {
		return {
			valid: false,
			message: "At least one offland location is required!",
		};
	} else if (job.makeLighterBooking && job.anchorageName === "") {
		return {
			valid: false,
			message: "Please select an anchorage location",
		};
	} else if (
		job.jobPICName.trim() !== "" &&
		job.jobPICContact.trim() === ""
	) {
		return {
			valid: false,
			message: "Please enter a valid PIC contact",
		};
	} else if (
		job.jobPICContact.trim() !== "" &&
		job.jobPICName.trim() === ""
	) {
		return {
			valid: false,
			message: "Please enter a valid PIC name",
		};
	} else if (
		!edit &&
		job.vesselLoadingLocation.type !== "port" &&
		moment(job.vesselLoadingDateTime).isBefore(new Date())
	) {
		return {
			valid: false,
			message:
				"Vessel Loading Date & Time must be after job booking time",
		};
	}

	if (job.hasBoarding && job.boardingName.trim() !== "") {
		const boardingName = job.boardingName.trim();
		const letters = /^[A-Za-z]+$/;
		if (!boardingName.match(letters)) {
			return {
				valid: false,
				message:
					"Please enter a valid boarding name, with only alphabets.",
			};
		}
	}

	if (job.hasBoarding && job.boardingContact.trim() !== "") {
		const boardingContact = job.boardingContact.trim();
		const numbers = /^[0-9]+$/;
		if (!boardingContact.match(numbers)) {
			return {
				valid: false,
				message:
					"Please enter a valid boarding contact, with only numbers.",
			};
		}
	}

	return {
		valid: true,
	};
};

const processJobData = (job) => {
	const filteredItems = filterItems(job.jobItems);
	const filteredJobOfflandItems = filterItems(job.jobOfflandItems);

	// Check for empty care-off entries
	const filteredCareOffParties = filterCareOffs();

	job.jobItems = filteredItems;
	job.jobOfflandItems = filteredJobOfflandItems;
	job.careOffParties = filteredCareOffParties;

	job.truckLogisticsCompany =
		job.truckLogisticsCompany._id === "Please Select"
			? null
			: job.truckLogisticsCompany;
	job.boatLogisticsCompany =
		job.boatLogisticsCompany._id === "Please Select"
			? null
			: job.boatLogisticsCompany;

	// Get Cargo Nets Count
	if (
		job.vesselLoadingLocation.type === "port" &&
		job.jobItems.length > 0 &&
		job.jobAdditionalItems.length === 0
	) {
		let numNets = 0;
		for (let i = 0; i < job.jobItems.length; i++) {
			const jobItem = job.jobItems[i];
			numNets += jobItem.quantity;
		}
		job.jobAdditionalItems = [
			{
				quantity: numNets,
				uom: "Cargo Net",
				job: this.state.job ? this.state.job._id : null,
			},
		];
	}

	return job;
};

export { validateJobCreation, processJobData };
