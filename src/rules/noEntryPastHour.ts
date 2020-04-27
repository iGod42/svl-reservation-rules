import {
	RuleParser,
	RuleDefinition,
	Rule,
	RuleEvaluationOptions,
	BulkRuleEvaluationOptions
} from "./api"
import { NoEntryPastHourDefinition } from "./api/NoEntryPastHourDefinition"
import formatWeekdays from '../tools/formatWeekdays'

const allWeekDays = [0, 1, 2, 3, 4, 5, 6]
class NoEntryPastHour implements Rule {
	readonly performanceImpact: number = 2
	private readonly definition

	constructor(definition: NoEntryPastHourDefinition) {
		this.definition = { weekDays: allWeekDays, ...definition }
	}

	private message = () => (this.definition.weekDays !== allWeekDays ? formatWeekdays(this.definition.weekDays, {
		weekdayText: "Wochentags",
		weekendText: "Wochenends"
	}) + " k" : "K") + `eine Reservierungen ab ${this.definition.hour} Uhr erlaubt`

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
