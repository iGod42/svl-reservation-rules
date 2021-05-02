import { findFirstMatchingUser } from "./helpers"
import { NoDoubleCourtReservationDefinition } from "./api/NoDoubleCourtReservationDefinition"
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
	private readonly definition: Required<NoDoubleCourtReservationDefinition>

	private readonly message = (userId: string, myUserId?: string) =>
		this.definition.maxCourts === 1
			? (myUserId === userId ? "Du hast" : `'${userId}' hat`) +
			  " bereits zur selben Stunde auf einem anderen Platz eingetragen"
			: `Du kannst max ${this.definition.maxCourts} Plätze gleichzeitig reservieren`

	constructor(definition: NoDoubleCourtReservationDefinition) {
		this.definition = {
			maxCourts: 1,
			...definition
		}
	}

	evaluate = ({
		reservation,
		allReservations,
		userId
	}: RuleEvaluationOptions) => {
		const overlappingUsers = allReservations
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
			.filter(a => !!a)

		if (
			overlappingUsers &&
			overlappingUsers.length >= this.definition.maxCourts
		)
			return this.message(overlappingUsers[0] || "Du", userId)
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
				const matches = otherRes
					.map(or => findFirstMatchingUser(or, [userId]))
					.filter(a => !!a)
				if (matches && matches.length >= this.definition.maxCourts)
					ri.violation = this.message(matches[0] || "Du", userId)
			}
		})
	}
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "noDoubleCourtReservation") {
		return new NoDoubleCourtReservations(definition)
	}
}

export default parse
