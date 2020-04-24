import { trimTimeComponent, addDays, getBeginningOfWeek } from "../tools"
import { getFilterForSameUser } from "./helpers"
import formatWeekdays from "../tools/formatWeekdays"
import { MaxPerRangeDefinition } from "../api/MaxPerRangeDefinition"
import { RuleEvaluation, RuleParser, RuleDefinition } from "../api"

const maxPerRange = (definition: MaxPerRangeDefinition): RuleEvaluation => ({
	reservation,
	allReservations
}) => {
	const {
		maximum,
		dayOffset = 0,
		dayRange = 1,
		startAtHour = 0,
		endAtHour = 24,
		applyToWeekdays = [0, 1, 2, 3, 4, 5, 6],
		startAtReservationDay,
		limitForUser = true,
		today: todayOption = new Date()
	} = definition

	const today = trimTimeComponent(
		startAtReservationDay ? reservation.hour : todayOption
	)

	const eow = dayRange === "EOW"
	const startDate = addDays(today, dayOffset)

	// this could be to startDate > endDate in which case nothing is considered which is correct
	const endDate = eow
		? addDays(getBeginningOfWeek(today), 7)
		: addDays(startDate, dayRange as number)

	if (reservation.hour < startDate || reservation.hour >= endDate) return

	const hour = reservation.hour.getHours()
	if (hour < startAtHour || hour >= endAtHour) return

	const sameUserFilter = !limitForUser
		? () => true
		: getFilterForSameUser(reservation)

	const dtf = new Intl.DateTimeFormat("de-AT")
	const formatDate = (date: Date): string => dtf.format(date)

	if (
		(allReservations || [])
			.filter(sameUserFilter)
			.filter(res => res.hour >= startDate)
			.filter(res => res.hour < endDate)
			.filter(res => res.hour.getHours() >= startAtHour)
			.filter(res => res.hour.getHours() < endAtHour)
			.filter(res => applyToWeekdays.includes(res.hour.getDay())).length <
		maximum
	)
		return

	let message = `Maximale Reservierungen (${maximum})`

	const endDateDisplay = new Date(endDate)
	endDateDisplay.setMilliseconds(endDateDisplay.getMilliseconds() - 1)

	message +=
		(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) > 1
			? ` von ${formatDate(startDate)} bis ${formatDate(endDateDisplay)}`
			: ` am ${formatDate(startDate)}`

	if (startAtHour !== 0 && endAtHour !== 24)
		message += ` zwischen ${startAtHour} und ${endAtHour} Uhr`
	else if (startAtHour !== 0) message += ` nach ${startAtHour} Uhr`
	else if (endAtHour !== 24) message += ` vor ${endAtHour} Uhr`

	if (applyToWeekdays.length !== 7)
		message +=
			" " +
			formatWeekdays(applyToWeekdays, {
				weekdayText: "Wochentags",
				weekendText: "Wochenends"
			})

	message += " überschritten"

	return message
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "maxPerRange") {
		return maxPerRange(definition as MaxPerRangeDefinition)
	}
}

export default parse
