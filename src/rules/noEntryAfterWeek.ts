import { addDays, getBeginningOfWeek, trimTimeComponent } from "../tools"
import {
	RuleDefinition,
	RuleParser,
	Rule,
	RuleEvaluationOptions,
	BulkRuleEvaluationOptions
} from "./api"
import { NoEntryAfterweekDefinition } from "./api/NoEntryAfterweekDefinition"

class NoEntryAfterweek implements Rule {
	private readonly definition
	readonly performanceImpact: number = 2

	constructor(definition: NoEntryAfterweekDefinition) {
		this.definition = definition
	}

	private getCutoffDate = (now = new Date()) =>
		trimTimeComponent(
			addDays(
				getBeginningOfWeek(now),
				7 * ((this.definition.offsetWeeks || 0) + 1)
			)
		)

	private message = () => this.definition.offsetWeeks === 1 ?
		"Du darfst nur bis in die nächste Woche eintragen" : 
		`Du darfst max ${this.definition.offsetWeeks} Woche${
			this.definition.offsetWeeks > 1 ? "n" : ""
		} in die Zukunft eintragen`

	evaluate = ({ reservation, now }: RuleEvaluationOptions) => {
		return this.getCutoffDate(now) < reservation.hour
			? this.message()
			: undefined
	}

	evaluateBulk = ({ reservationsInfo, now }: BulkRuleEvaluationOptions) => {
		reservationsInfo
			.filter(ri => !ri.violation && this.getCutoffDate(now) < ri.hour)
			.forEach(ri => (ri.violation = this.message()))
	}
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noEntryAfterWeek") {
		return new NoEntryAfterweek(definition as NoEntryAfterweekDefinition)
	}
}

export default parse
