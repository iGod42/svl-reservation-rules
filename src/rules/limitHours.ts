import { LimitHoursDefinition } from "./api/LimitHoursDefinition"
import { RuleDefinition, RuleEvaluationOptions, RuleParser, Rule, BulkRuleEvaluationOptions } from "./api"

class LimitHours implements Rule {
	private readonly definition;

	readonly performanceImpact = 1

	constructor(definition: LimitHoursDefinition) {
		this.definition = definition
	}

	private errorMessage = () => {
		const { startHour, endHour } = this.definition
		return `Eintragen nur zwischen ${startHour}:00 und ${endHour}:00 Uhr zur vollen Stunde möglich`
	}

	private checkDate = (date: Date) =>
		date.getHours() < this.definition.startHour ||
		date.getHours() > this.definition.endHour ||
		date.getMinutes() !== 0 ||
		date.getSeconds() !== 0 ||
		date.getMilliseconds() !== 0

	evaluate = ({ reservation }: RuleEvaluationOptions) => {
		if (this.checkDate(reservation.hour))
			return this.errorMessage()
	}

	evaluateBulk = ({ reservationsInfo }: BulkRuleEvaluationOptions) => {
		reservationsInfo
			.filter(ri => !ri.violation) // no need to check again if there is already an error
			.filter(ri => this.checkDate(ri.hour))
			.forEach(ri => ri.violation = this.errorMessage())
	}
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "limitHours") {
		return new LimitHours(definition as LimitHoursDefinition)
	}
}

export default parse
