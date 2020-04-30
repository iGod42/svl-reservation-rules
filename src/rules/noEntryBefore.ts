import { NoEntryBeforeDefinition } from "./api/NoEntryBeforeDefinition"
import {
	RuleParser,
	RuleDefinition,
	Rule,
	RuleEvaluationOptions,
	BulkRuleEvaluationOptions
} from "./api"
import { addDays } from "../tools"

class NoEntryBefore implements Rule {
	readonly performanceImpact: number = 1
	private readonly definition

	constructor(definition: NoEntryBeforeDefinition) {
		this.definition = definition
	}

	private message = () =>
		this.definition.messageOverride ||
		"Eintragen erst nach der angefangenen Stunde möglich"

	private filter = (now = new Date()) => (compDate: Date) =>
		compDate <
		addDays(
			new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				now.getHours() + 1
			),
			-this.definition.dayOffset || 0
		)

	evaluate = ({ reservation, now }: RuleEvaluationOptions) =>
		this.filter(now)(reservation.hour) ? this.message() : undefined

	evaluateBulk = ({ reservationsInfo, now }: BulkRuleEvaluationOptions) => {
		reservationsInfo
			.filter(ri => !ri.violation && this.filter(now)(ri.hour))
			.forEach(ri => (ri.violation = this.message()))
	}
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noEntryBefore") {
		return new NoEntryBefore(definition as NoEntryBeforeDefinition)
	}
}

export default parse
