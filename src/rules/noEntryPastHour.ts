import {
	RuleParser,
	RuleDefinition,
	Rule,
	RuleEvaluationOptions,
	BulkRuleEvaluationOptions
} from "./api"
import { NoEntryPastHourDefinition } from "./api/NoEntryPastHourDefinition"

class NoEntryPastHour implements Rule {
	readonly performanceImpact: number = 2
	private readonly definition

	constructor(definition: NoEntryPastHourDefinition) {
		this.definition = { weekDays: [0, 1, 2, 3, 4, 5, 6], ...definition }
	}

	private message = () =>
		`Keine Reservierungen ab ${this.definition.hour} Uhr erlaubt`

	private filter = (compDate: Date) =>
		compDate.getHours() >= this.definition.hour &&
		this.definition.weekDays.includes(compDate.getDay())

	evaluate = ({ reservation }: RuleEvaluationOptions) =>
		this.filter(reservation.hour) ? this.message() : undefined

	evaluateBulk = ({ reservationsInfo }: BulkRuleEvaluationOptions) =>
		reservationsInfo
			.filter(ri => !ri.violation && this.filter(ri.hour))
			.forEach(ri => (ri.violation = this.message()))
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noEntryPastHour") {
		return new NoEntryPastHour(definition as NoEntryPastHourDefinition)
	}
}

export default parse
