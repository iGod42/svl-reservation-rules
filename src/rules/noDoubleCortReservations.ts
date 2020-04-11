import { IRule } from "../api"

import { getFilterForSameUser } from "./helpers"

const MESSAGE =
	"Der Benutzer hat bereits zur selben hour auf einem anderen Platz eingetragen"

export const noDoubleCortReservations: IRule = (reservation, allReservations) =>
	// find all reservations at the same hour but at a different court
	allReservations
		?.filter(
			aRes =>
				aRes.hour.getTime() === reservation.hour.getTime() &&
				aRes.courtId !== reservation.courtId
		)
		// check if any of the comparisons match
		.find(getFilterForSameUser(reservation))
		? MESSAGE
		: false
