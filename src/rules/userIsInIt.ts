import { RuleParser, RuleDefinition, Rule, RuleEvaluationOptions, BulkRuleEvaluationOptions } from "./api"
import { findFirstMatchingUser } from './helpers'

class UserIsInIt implements Rule {
	readonly performanceImpact: number = 5

	private message = (userId: string) => `Benutzer '${userId}' ist nicht in der Reservierung`

	evaluate = ({ reservation, userId }: RuleEvaluationOptions) =>
		userId && !findFirstMatchingUser(reservation, [userId]) ?
			this.message(userId) : undefined

	evaluateBulk = ({ reservationsInfo, userId }: BulkRuleEvaluationOptions) => {
		if (!userId) return

		reservationsInfo
			.filter(ri => ri.reservation && !findFirstMatchingUser(ri.reservation, [userId]))
			.forEach(ri => {
				ri.violation = this.message(userId)
			})
	}
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "userIsInIt") {
		return new UserIsInIt()
	}
}

export default parse
