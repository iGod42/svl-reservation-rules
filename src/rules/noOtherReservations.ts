import { RuleEvaluation, RuleParser, RuleDefinition } from "./api"

const MESSAGE = "Die Stunde wurde bereits reserviert!"

const noOtherReservations: RuleEvaluation = ({
	reservation,
	allReservations
}) => {
	if (!allReservations) throw new Error("allReservations is missing")

	return allReservations.find(
		er =>
			er.hour.getTime() === reservation.hour.getTime() &&
			er.courtId === reservation.courtId
	)
		? MESSAGE
		: undefined
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noOtherReservations") {
		return noOtherReservations
	}
}

export default parse
