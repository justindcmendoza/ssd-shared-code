import _ from "lodash";
import moment from "moment";

const vesselLoadingLocationChange = (
	vesselId,
	vesselLoadingLocations,
	vessels,
	vesselLoadingDateTime,
	vesselIMOID,
	edit
) => {
	const vesselLoadingLocation = _.find(vesselLoadingLocations, [
		"_id",
		vesselId,
		edit,
	]);

	let newVesselLoadingDateTime = vesselLoadingDateTime;
	// Set vessel loading time if PSA delivery.
	if (vesselLoadingLocation.type === "port" && !edit) {
		const vessel = _.find(vessels, ["vesselIMOID", vesselIMOID]);
		newVesselLoadingDateTime = getAutomatedVesselLoadingDateTime(vessel)
			? getAutomatedVesselLoadingDateTime(vessel)
			: vesselLoadingDateTime;
	}

	return {
		vesselLoadingLocation,
		vesselLoadingDateTime: newVesselLoadingDateTime,
	};
};

const getAutomatedVesselLoadingDateTime = (vessel) => {
	const psaTimeComparator = new Date();

	const psaVessel = vessel ? vessel.psaVessel : null;
	let psaBerthingDateTime = psaVessel ? psaVessel.estimatedBerthTime : null;
	let psaUnberthingDateTime = psaVessel
		? psaVessel.estimatedUnberthTime
		: null;

	const psaQuayCraneSequence = vessel ? vessel.psaQuayCraneSequence : null;
	const seqTimeFrom = psaQuayCraneSequence
		? psaQuayCraneSequence.seqTimeFrom
		: null;
	const seqTimeTo = psaQuayCraneSequence
		? psaQuayCraneSequence.seqTimeTo
		: null;
	const ETB = psaQuayCraneSequence ? psaQuayCraneSequence.ETB : null;
	const ETU = psaQuayCraneSequence ? psaQuayCraneSequence.ETU : null;
	if (seqTimeFrom && moment(seqTimeFrom).isAfter(psaTimeComparator)) {
		psaBerthingDateTime = ETB ? ETB : psaBerthingDateTime;
		psaUnberthingDateTime = ETU ? ETU : psaUnberthingDateTime;
	}

	return moment(psaBerthingDateTime).isSameOrAfter(new Date())
		? moment(psaBerthingDateTime).add(1, "hours")
		: null;
};

const filterVesselLoadingLocations = (
	vesselLoadingLocations,
	makeLighterBooking
) => {
	const sortedVesselLoadingLocations = [];
	let otherVesselLoadingLocation = null;

	for (let i = 0; i < vesselLoadingLocations.length; i++) {
		const vesselLoadingLocation = vesselLoadingLocations[i];
		if (makeLighterBooking) {
			if (vesselLoadingLocation.type === "anchorage") {
				sortedVesselLoadingLocations.push(vesselLoadingLocation);
			}
		} else {
			if (vesselLoadingLocation.type !== "others") {
				sortedVesselLoadingLocations.push(vesselLoadingLocation);
			} else {
				otherVesselLoadingLocation = vesselLoadingLocation;
			}
		}
	}

	if (otherVesselLoadingLocation) {
		sortedVesselLoadingLocations.push(otherVesselLoadingLocation);
	}

	return sortedVesselLoadingLocations;
};

const filterAnchorage = (option, props) => {
	let text = props.text.toLowerCase();
	if (
		option.name.toLowerCase().indexOf(text) !== -1 ||
		option.code.toLowerCase().indexOf(text) !== -1
	) {
		option.priority = 1;
		return true;
	}
	let textArr = text.split(" ");
	let res = false;
	for (let i = 0; i < textArr.length; i++) {
		const o = textArr[i];
		if (
			o.length >= 3 &&
			(option.name.toLowerCase().split(" ").includes(o) ||
				option.code.toLowerCase().split(" ").includes(o))
		) {
			option.priority = 2;
			res = true;
			break;
		}
	}
	return res;
};

const filterVessel = (option, keyword, type) => {
	let text = keyword.toLowerCase();
	if (
		option.vesselCallsign.toLowerCase().indexOf(text) !== -1 ||
		option.vesselIMOID.toLowerCase().indexOf(text) !== -1 ||
		option.vesselName.toLowerCase().indexOf(text) !== -1
	) {
		option.priority = 1;
		return true;
	}
	let textArr = text.split(" ");
	let res = false;
	for (let i = 0; i < textArr.length; i++) {
		const o = textArr[i];
		if (o.length >= 3) {
			switch (type) {
				case "vessel":
					if (
						option.vesselCallsign
							.toLowerCase()
							.split(" ")
							.includes(o) ||
						option.vesselIMOID
							.toLowerCase()
							.split(" ")
							.includes(o) ||
						option.vesselName.toLowerCase().split(" ").includes(o)
					) {
						option.priority = 2;
						res = true;
					}
					break;

				case "anchorage":
					if (
						option.name.toLowerCase().split(" ").includes(o) ||
						option.code.toLowerCase().split(" ").includes(o)
					) {
						option.priority = 2;
						res = true;
						break;
					}
			}
		}
	}

	return res;
};

const filterItems = (items) => {
	// Check for empty item entries
	const filteredItems = [];
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (item.quantity !== "" && item.uom !== "") {
			delete item["id"];
			filteredItems.push(item);
		}
	}
	return filteredItems;
};

const filterCareOffs = (careOffParties) => {
	// Check for empty care-off entries
	const filteredCareOffParties = [];
	for (let i = 0; i < careOffParties.length; i++) {
		const careOffParty = careOffParties[i];
		if (
			careOffParty.companyName !== "" &&
			careOffParty.personName !== "" &&
			careOffParty.contactNumber !== "" &&
			careOffParty.email !== ""
		) {
			delete careOffParty["id"];
			filteredCareOffParties.push(careOffParty);
		}
	}

	return filteredCareOffParties;
};

const filterNonVesselDelivery = (
	vesselLoadingLocationType,
	otherVesselLoadingLocation,
	vesselLoadingLocations
) => {
	if (vesselLoadingLocationType !== "others") {
		return false;
	} else {
		const jpKeyWordList = {
			"Marina South Wharves": ["msw", "marina south wharves"],
			"Penjuru Terminal": ["pjr", "penjuru terminal", "plt"],
		};
		const psaKeyWords = ["psa"];
		let finalVesselLoadingLocation;

		// Check for JP keywords
		let keyWordExists = false;
		for (const key in jpKeyWordList) {
			const jpKeyWords = jpKeyWordList[key];
			for (let i = 0; i < jpKeyWords.length; i++) {
				const jpKeyWord = jpKeyWords[i];
				if (
					otherVesselLoadingLocation
						.trim()
						.toLowerCase()
						.includes(jpKeyWord)
				) {
					keyWordExists = true;
					const vesselLoadingLocation = _.find(
						vesselLoadingLocations,
						["name", key]
					);
					finalVesselLoadingLocation = vesselLoadingLocation;
					break;
				}
			}
		}

		// Check for PSA keywords
		if (!keyWordExists) {
			for (let i = 0; i < psaKeyWords.length; i++) {
				const psaKeyWord = psaKeyWords[i];
				if (
					otherVesselLoadingLocation
						.trim()
						.toLowerCase()
						.includes(psaKeyWord)
				) {
					keyWordExists = true;
					const vesselLoadingLocation = _.find(
						vesselLoadingLocations,
						["name", "PSA"]
					);
					finalVesselLoadingLocation = vesselLoadingLocation;
					break;
				}
			}
		}
		return {
			keyWordExists: !keyWordExists,
			vesselLoadingLocation: finalVesselLoadingLocation,
		};
	}
};

const processJobData = (job) => {
	const filteredItems = filterItems(job.jobItems);
	const filteredJobOfflandItems = filterItems(job.jobOfflandItems);

	// Check for empty care-off entries
	// const filteredCareOffParties = filterCareOffs();

	job.jobItems = filteredItems;
	job.jobOfflandItems = filteredJobOfflandItems;
	// job.careOffParties = filteredCareOffParties;

	// job.truckLogisticsCompany =
	// 	job.truckLogisticsCompany._id === "Please Select"
	// 		? null
	// 		: job.truckLogisticsCompany;
	// job.boatLogisticsCompany =
	// 	job.boatLogisticsCompany._id === "Please Select"
	// 		? null
	// 		: job.boatLogisticsCompany;

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
				job: job ? job._id : null,
			},
		];
	}

	let newJobData = {
		jobId: job.index,
		vesselIMOID: job.vessel.vesselIMOID,
		vesselName: job.vessel.vesselName,
		vesselCallsign: job.vessel.vesselCallsign,
		anchorageCode: job.vesselAnchorageLocation.code,
		truckLogisticsCompany: job.truckLogisticsCompany,
		// boatLogisticsCompany,
		vesselLoadingLocation: job.vesselLoadingLocation,
		vesselArrivalDateTime: job.vesselArrivalDateTime,
		jobItems: job.jobItems,
		makeTruckBooking: job.makeTruckBooking,
		makeLighterBooking: job.makeLighterBooking,
		jobPICName: job.jobPICName,
		jobPICContact: job.jobPICContact,
		jobOfflandItems: job.jobOfflandItems,
		careOffParties: job.careOffParties,
		remarks: job.remarks,
		psaBerthingDateTime: job.psaBerthingDateTime,
		adminRemarks: job.adminRemarks,
		boardingName: job.boardingName,
		boardingContact: job.boardingContact,
		createOfflandPermit: job.createOfflandPermit,
		psaUnberthingDateTime: job.psaUnberthingDateTime,
		vesselLoadingDateTime: job.vesselLoadingDateTime,
		createDSA: job.createDSA,
		pickup: job.pickup,
		pickupDetails: job.pickupDetails,
		offlandDetails: job.offlandDetails,
		vesselLighterCompany: job.vesselLighterCompany,
		vesselLighterName: job.vesselLighterName,
		vesselLighterLocation: job.vesselLighterLocation,
		vesselLighterRemarks: job.vesselLighterRemarks,
		otherVesselLoadingLocation: job.otherVesselLoadingLocation,
		hasBoarding: job.hasBoarding,
		user: job.user,
		// logisticsCompany,
		jobAdditionalItems: job.jobAdditionalItems,
		hasDGItems: job.hasDGItems,
	};
	return newJobData;
};

export {
	vesselLoadingLocationChange,
	getAutomatedVesselLoadingDateTime,
	filterAnchorage,
	filterVessel,
	filterItems,
	filterCareOffs,
	filterNonVesselDelivery,
	filterVesselLoadingLocations,
	processJobData,
};
