import { RuleEvaluation, RuleParser } from "../api"

const limitToCourts = (
	courtIds: number[],
	afterHour,
	weekDays = [0, 1, 2, 3, 4, 5, 6]
): RuleEvaluation => ({ reservation }) => {
	const std = reservation.hour
	const court = reservation.courtId

	if (
		weekDays.includes(std.getDay()) &&
		courtIds.includes(court) &&
		std.getHours() >= afterHour
	)
		return `Keine Reservierung von Platz ${court}${
			afterHour > 0 ? ` nach ${afterHour} Uhr` : ""
		} erlaubt`
}

const parse: RuleParser = rule => {
	if (rule.type === "limitToCourts") {
		const { courtIds, afterHour = 0, weekDays = [0, 1, 2, 3, 4, 5, 6] } = rule
		if (!courtIds || !Array.isArray(courtIds))
			throw new Error("courtIds needs to be set and an array")

		return limitToCourts(courtIds, afterHour, weekDays)
	}
}

export default parse
