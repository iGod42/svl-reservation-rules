import {
	RuleParser,
	Rule,
	RuleEvaluationOptions,
	BulkRuleEvaluationOptions
} from "./api"

class LimitToCourts implements Rule {
	readonly performanceImpact: number = 3
	private readonly courtIds: number[]
	private readonly afterHour: number
	private readonly weekDays: number[]
	constructor(
		courtIds: number[],
		afterHour = 0,
		weekDays = [0, 1, 2, 3, 4, 5, 6]
	) {
		this.courtIds = courtIds
		this.afterHour = afterHour
		this.weekDays = weekDays
	}

	private message = (court: number | string) =>
		`Keine Reservierung von Platz ${court}${
			this.afterHour > 0 ? ` nach ${this.afterHour} Uhr` : ""
		} erlaubt`

	private filter = (std: Date, court: number) =>
		this.weekDays.includes(std.getDay()) &&
		!this.courtIds.includes(court) &&
		std.getHours() >= this.afterHour

	evaluate = ({ reservation }: RuleEvaluationOptions) => {
		const std = reservation.hour
		const court = reservation.courtId
		if (this.filter(std, court)) return this.message(court)
	}

	evaluateBulk = ({ reservationsInfo }: BulkRuleEvaluationOptions) => {
		reservationsInfo
			.filter(ri => !ri.violation)
			.filter(ri => this.filter(ri.hour, ri.courtId))
			.forEach(ri => (ri.violation = this.message(ri.courtId)))
	}
}

const parse: RuleParser = rule => {
	if (rule.type === "limitToCourts") {
		const { courtIds, afterHour = 0, weekDays = [0, 1, 2, 3, 4, 5, 6] } = rule
		if (!courtIds || !Array.isArray(courtIds))
			throw new Error("courtIds needs to be set and an array")

		return new LimitToCourts(courtIds, afterHour, weekDays)
	}
}

export default parse
