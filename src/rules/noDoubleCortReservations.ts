import {IRule} from "api"

const {getFilterForSameUser} = require("./helpers")

const MESSAGE = "Der Benutzer hat bereits zur selben Stunde auf einem anderen Platz eingetragen"

export const noDoubleCortReservations: IRule = (reservation, allReservations) =>
	// find all reservations at the same hour but at a different court
	allReservations?.filter(aRes => aRes.Stunde.getTime() === reservation.Stunde.getTime() && aRes.PlatzID !== reservation.PlatzID)
		// check if any of the comparisons match
		.find(getFilterForSameUser(reservation)) ?
		MESSAGE :
		false