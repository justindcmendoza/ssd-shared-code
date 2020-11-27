export default class Vessel {
	psaVessels = [];
	psaVessel = {}; // Latest PSA Vessel
	mpaVessel = {};
	marineTrafficVessel = {};
	psaQuayCraneSequence = {}; // Latest PSA QC Sequence

	// Vessel details from MPA sources
	vesselIMOID = "";
	vesselName = "";
	vesselCallsign = "";
	vesselFlag = "";
	vesselLength = 0;
	vesselBreadth = 0;
	vesselDepth = 0;
	vesselType = "";
	vesselGrossTonnage = 0;
	vesselNetTonnage = 0;
	vesselDeadWeight = 0;
	vesselMMSINumber = "";
	vesselYearBuilt = "";
	vesselIsmManager = "";
	vesselShipManager = "";
	vesselRegisteredOwnership = "";
	vesselClassificationSociety = "";
	arrivalDateTimeSG = new Date();

	// Last date & time updated.
	dateTimeUpdated = new Date();

	constructor() {
		//...
	}
}
