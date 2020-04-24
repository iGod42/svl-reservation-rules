import { addDays, getBeginningOfWeek, trimTimeComponent } from "../tools"
import { RuleEvaluation, RuleDefinition, RuleParser } from "../api"
import { NoEntryAfterweekDefinition } from "../api/NoEntryAfterweekDefinition"

const noEntryAfterWeek = (
	definition: NoEntryAfterweekDefinition
): RuleEvaluation => ({ reservation }) => {
	const { offsetWeeks = 0 } = definition
	const targetDate = reservation.hour
	const cutoffDate = trimTimeComponent(
		addDays(getBeginningOfWeek(new Date()), 7 * (offsetWeeks + 1))
	)

	if (cutoffDate < targetDate)
		return `Du darfst max ${offsetWeeks} Woche${
			offsetWeeks > 1 ? "n" : ""
		} in die Zukunft eintragen`
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noEntryAfterWeek") {
		return noEntryAfterWeek(definition as NoEntryAfterweekDefinition)
	}
}

export default parse
