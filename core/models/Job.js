import moment from "moment";

export default class Job {
	_id = "";
	jobId = "";
	vessel = {};
	jobTrackers = [];
	paymentTrackers = [];
	vesselLoadingLocation = {};
	otherVesselLoadingLocation = {};
	user = {};
	index = "";
	jobItems = [];
	jobOfflandItems = [];
	jobAdditionalItems = [];
	careOffParties = [];
	jobBookingDateTime = new Date();
	vesselArrivalDateTime = new Date();
	remarks = "";
	adminRemarks = "";
	vesselLoadingDateTime = moment(new Date()).subtract(1, "days").toDate();
	psaBerthingDateTime = null;
	psaUnberthingDateTime = null;
	googleCalendarId = "";
	isCancelled = "Nil";
	cancellationRemarks = "";
	isArchived = false;
	createDSA = false;
	createOfflandPermit = false;
	hasBoarding = false;
	hasDGItems = false;
	pickup = false;
	pickupDetails = [];
	offlandDetails = [];
	vesselLighterName = "";
	vesselLighterLocation = "Marina South Wharves";
	vesselLighterCompany = "";
	vesselLighterRemarks = "";
	vesselAnchorageLocation = {};
	jobTrip = {};
	psaQuayCraneSequences = [];
	jobTrackerRemarks = "";
	psaVoyageNumberIn = "";
	psaVoyageNumberOut = "";
	psaBerf = "";
	telegramMessageId = "";
	estimatedJobPricingBreakdowns = [];
	actualJobPricingBreakdowns = [];
	isDeleted = false;
	status = "PENDING";
	boardingName = "";
	boardingContact = "";
	jobPICName = "";
	jobPICContact = "";
	services = [];
	version = 1;
	lighterBoatCompany = {};

	makeTruckBooking = false;
	makeLighterBooking = false;
	truckLogisticsCompany = null;

	constructor() {
		//...
	}
}
