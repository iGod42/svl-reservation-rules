import { NoEntryBeforeDefinition } from "api/NoEntryBeforeDefinition"
import { RuleEvaluation, RuleParser, RuleDefinition } from "api"

const MESSAGE = "Eintragen erst nach der angefangenen Stunde möglich"

const noEntryBefore = (options: NoEntryBeforeDefinition): RuleEvaluation => ({
	reservation
}) => {
	const { dayOffset = 0, messageOverride } = options

	const now = new Date()
	// get start of current hour
	const compHour = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		now.getHours() + 1,
		0,
		0,
		0
	)
	// apply offset
	compHour.setDate(compHour.getDate() - dayOffset)

	if (reservation.hour < compHour) return messageOverride || MESSAGE
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noEntryBefore") {
		return noEntryBefore(definition as NoEntryBeforeDefinition)
	}
}

export default parse
