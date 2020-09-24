import _ from "lodash";
import moment from "moment";

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

const handleVesselLoadingLocationChange = async (
	event,
	vesselLoadingLocations,
	vessels,
	vesselLoadingDateTime,
	vesselIMOID,
	edit
) => {
	const vesselLoadingLocation = _.find(vesselLoadingLocations, [
		"_id",
		event.target.value,
	]);

	// Set vessel loading time if PSA delivery.
	let vesselLoadingDateTime = vesselLoadingDateTime;
	if (vesselLoadingLocation.type === "port" && !edit) {
		const vessel = _.find(vessels, ["vesselIMOID", vesselIMOID]);
		vesselLoadingDateTime = getAutomatedVesselLoadingDateTime(vessel)
			? getAutomatedVesselLoadingDateTime(vessel)
			: vesselLoadingDateTime;
	}

	return { vesselLoadingLocation, vesselLoadingDateTime };
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

const filterVessel = (option, props) => {
	let text = props.text.toLowerCase();
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
		if (
			o.length >= 3 &&
			(option.vesselCallsign.toLowerCase().split(" ").includes(o) ||
				option.vesselIMOID.toLowerCase().split(" ").includes(o) ||
				option.vesselName.toLowerCase().split(" ").includes(o))
		) {
			option.priority = 2;
			res = true;
			break;
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

const filterCareOffs = () => {
	// Check for empty care-off entries
	const careOffParties = this.state.careOffParties;
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
	otherVesselLoadingLocation
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
						this.state.vesselLoadingLocations,
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
						this.state.vesselLoadingLocations,
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

export {
	getAutomatedVesselLoadingDateTime,
	handleVesselLoadingLocationChange,
	filterAnchorage,
	filterVessel,
	filterItems,
	filterCareOffs,
	filterNonVesselDelivery,
};
