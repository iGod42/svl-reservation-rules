import { getFilterForSameUser } from "./helpers"
import { RuleEvaluation, RuleParser, RuleDefinition } from "../api"

const MESSAGE =
	"Du hast bereits zur selben Stunde auf einem anderen Platz eingetragen"

const noDoubleCourtReservations: RuleEvaluation = ({
	reservation,
	allReservations
}) =>
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
		: undefined

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noDoubleCourtReservation") {
		return noDoubleCourtReservations
	}
}

export default parse
