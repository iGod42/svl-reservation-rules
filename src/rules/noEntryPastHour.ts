import { RuleParser, RuleDefinition, RuleEvaluation } from "api"
import { NoEntryPastHourDefinition } from "api/NoEntryPastHourDefinition"

const noEntryPastHour = (
	definition: NoEntryPastHourDefinition
): RuleEvaluation => ({ reservation }) => {
	const { hour, weekDays = [0, 1, 2, 3, 4, 5, 6] } = definition

	const std = reservation.hour
	if (std.getHours() >= hour && weekDays.includes(std.getDay()))
		return `Keine Reservierungen ab ${hour} Uhr erlaubt`
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noEntryPastHour") {
		return noEntryPastHour(definition as NoEntryPastHourDefinition)
	}
}

export default parse
