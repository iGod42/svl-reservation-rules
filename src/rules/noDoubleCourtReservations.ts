import { findFirstMatchingUser } from "./helpers"
import {
	RuleParser,
	RuleDefinition,
	Rule,
	Reservation,
	RuleEvaluationOptions,
	BulkRuleEvaluationOptions
} from "./api"

class NoDoubleCourtReservations implements Rule {
	readonly performanceImpact: number = 20

	private readonly message = (userId: string, myUserId?: string) =>
		(myUserId === userId ? "Du hast" : `'${userId}' hat`) +
		" bereits zur selben Stunde auf einem anderen Platz eingetragen"

	evaluate = ({
		reservation,
		allReservations,
		userId
	}: RuleEvaluationOptions) => {
		const overlappingUser = allReservations
			?.filter(
				aRes =>
					aRes.hour.getTime() === reservation.hour.getTime() &&
					aRes.courtId !== reservation.courtId
			)
			.map(res =>
				findFirstMatchingUser(
					res,
					reservation.players.concat(reservation.reservedBy).map(u => u.id)
				)
			)
			.find(a => !!a)

		if (overlappingUser) return this.message(overlappingUser, userId)
	}

	evaluateBulk = ({
		reservationsInfo,
		allReservations,
		userId
	}: BulkRuleEvaluationOptions) => {
		if (!userId || !allReservations) return

		// group by hour
		const grouped = allReservations.reduce<{ [key: number]: Reservation[] }>(
			(grouped, current) => {
				const hourNumber = current.hour.getTime()
				if (!grouped[hourNumber]) grouped[hourNumber] = []

				grouped[hourNumber].push(current)
				return grouped
			},
			{}
		)

		reservationsInfo.forEach(ri => {
			const otherRes = grouped[ri.hour.getTime()]
			if (otherRes) {
				const match = otherRes
					.map(or => findFirstMatchingUser(or, [userId]))
					.find(a => !!a)
				if (match) ri.violation = this.message(match, userId)
			}
		})
	}
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noDoubleCourtReservation") {
		return new NoDoubleCourtReservations()
	}
}

export default parse
