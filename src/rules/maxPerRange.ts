import { trimTimeComponent, addDays, getBeginningOfWeek } from "../tools"
import { findFirstMatchingUser } from "./helpers"
import formatWeekdays from "../tools/formatWeekdays"
import { MaxPerRangeDefinition } from "./api/MaxPerRangeDefinition"
import {
	RuleParser,
	RuleDefinition,
	Rule,
	RuleEvaluationOptions,
	BulkRuleEvaluationOptions,
	Reservation
} from "./api"
import { ReservationInfo } from "../evaluation/ReservationInfo"

class MaxPerRange implements Rule {
	private readonly definition: Required<MaxPerRangeDefinition>
	readonly performanceImpact: number
	private readonly dtf

	constructor(definition: MaxPerRangeDefinition) {
		this.definition = {
			dayOffset: 0,
			dayRange: 1,
			startAtHour: 0,
			endAtHour: 24,
			applyToWeekdays: [0, 1, 2, 3, 4, 5, 6],
			limitForUser: true,
			startAtReservationDay: false,
			offsetStart: "no",
			...definition
		}

		this.dtf = new Intl.DateTimeFormat("de-AT")
		this.performanceImpact =
			(definition.startAtReservationDay ? 100 : 30) -
			(definition.limitForUser ? 1 : 0)
	}

	private formatDate = (date: Date): string => this.dtf.format(date)

	private message = (startDate: Date, endDate: Date) => {
		let theMessage = `Maximale Reservierungen (${this.definition.maximum})`

		const endDateDisplay = new Date(endDate)
		endDateDisplay.setMilliseconds(endDateDisplay.getMilliseconds() - 1)

		theMessage +=
			(endDateDisplay.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) >
				1
				? ` von ${this.formatDate(startDate)} bis ${this.formatDate(
					endDateDisplay
				)}`
				: ` am ${this.formatDate(startDate)}`

		if (this.definition.startAtHour !== 0 && this.definition.endAtHour !== 24)
			theMessage += ` zwischen ${this.definition.startAtHour} und ${this.definition.endAtHour} Uhr`
		else if (this.definition.startAtHour !== 0)
			theMessage += ` nach ${this.definition.startAtHour} Uhr`
		else if (this.definition.endAtHour !== 24)
			theMessage += ` vor ${this.definition.endAtHour} Uhr`

		if (this.definition.applyToWeekdays.length !== 7)
			theMessage +=
				" " +
				formatWeekdays(this.definition.applyToWeekdays, {
					weekdayText: "Wochentags",
					weekendText: "Wochenends"
				})

		theMessage += " überschritten"

		return theMessage
	}

	private getToday = (hour: Date, now: Date) =>
		trimTimeComponent(this.definition.startAtReservationDay ? hour : now)

	private getStartDate = (hour: Date, now: Date) =>
		this.definition.dayOffset === "SOW"
			? getBeginningOfWeek(this.getToday(hour, now))
			: addDays(this.getToday(hour, now), this.definition.dayOffset)
	private getEndDate = (hour: Date, now: Date) =>
		this.definition.dayRange === "EOW"
			? addDays(getBeginningOfWeek(this.getToday(hour, now)), 7)
			: addDays(this.getStartDate(hour, now), this.definition.dayRange)

	private isHourInRange = (hour: Date, startDate: Date, endDate: Date) =>
		hour.getTime() >= startDate.getTime() &&
		hour.getTime() < endDate.getTime() &&
		hour.getHours() >= this.definition.startAtHour &&
		hour.getHours() < this.definition.endAtHour &&
		this.definition.applyToWeekdays.includes(hour.getDay())

	private filter = (
		allReservations: Reservation[] = [],
		userIds: string[],
		startDate: Date,
		endDate: Date,
	) => {
		return (
			allReservations
				.filter(
					res =>
						!this.definition.limitForUser || findFirstMatchingUser(res, userIds)
				)
				.filter(res => this.isHourInRange(res.hour, startDate, endDate))
				.length >= this.definition.maximum
		)
	}

	private getBeginActiveDate = (now: Date): Date | undefined => {
		if (this.definition.offsetStart === "no") return

		if (this.definition.offsetStart === 'start-of-next-week')
			return addDays(getBeginningOfWeek(now), 7)

		return addDays(trimTimeComponent(now), this.definition.offsetStart)
	}

	evaluate = ({
		reservation,
		allReservations,
		now = new Date()
	}: RuleEvaluationOptions) => {
		const startDate = this.getStartDate(reservation.hour, now)
		const endDate = this.getEndDate(reservation.hour, now)
		const beginActiveDate = this.getBeginActiveDate(now)

		// if hour to reserve is before active date -> no evaluation necessary as rule is not active
		if (reservation.hour.getTime() < (beginActiveDate?.getTime() || 0))
			return

		if (reservation.hour < startDate || reservation.hour >= endDate) return

		if (
			reservation.hour.getHours() < this.definition.startAtHour ||
			reservation.hour.getHours() >= this.definition.endAtHour
		)
			return

		return this.filter(
			allReservations,
			reservation.players.concat(reservation.reservedBy).map(u => u.id),
			startDate,
			endDate
		)
			? this.message(
				this.getStartDate(reservation.hour, now),
				this.getEndDate(reservation.hour, now)
			)
			: undefined
	}

	evaluateBulk = ({
		reservationsInfo,
		allReservations,
		now = new Date(),
		userId
	}: BulkRuleEvaluationOptions) => {
		const userIds = userId ? [userId] : []
		const beginActiveDate = this.getBeginActiveDate(now)

		const relevantInfo = reservationsInfo.filter(
			ri =>
				ri.hour.getHours() >= this.definition.startAtHour &&
				ri.hour.getHours() < this.definition.endAtHour &&
				ri.hour.getTime() >= (beginActiveDate?.getTime() || 0)
		)

		const applyRange = (startDate: Date, endDate: Date) => {
			if (this.filter(allReservations, userIds, startDate, endDate))
				// we fail all the infos in that range
				relevantInfo
					.filter(
						ri =>
							!ri.violation && this.isHourInRange(ri.hour, startDate, endDate)
					)
					.forEach(fi => (fi.violation = this.message(startDate, endDate)))
		}

		// if we're dealing with a static range
		if (!this.definition.startAtReservationDay) {
			const startDate = this.getStartDate(now, now)
			const endDate = this.getEndDate(now, now)

			applyRange(startDate, endDate)
		} else {
			// rule evaluation can only happen day based, so we group for days
			const dayGroups = relevantInfo.reduce<{
				[key: number]: ReservationInfo[]
			}>((grouped, current) => {
				const dayMs = trimTimeComponent(current.hour).getTime()
				if (!grouped[dayMs]) grouped[dayMs] = []
				grouped[dayMs].push(current)
				return grouped
			}, {})

			Object.keys(dayGroups)
				.map(a => parseInt(a))
				.forEach(dayMs => {
					const date = new Date(dayMs)
					const startDate = this.getStartDate(date, now)
					const endDate = this.getEndDate(date, now)
					applyRange(startDate, endDate)
				})
		}
	}
}

const parse: RuleParser = (definition: RuleDefinition) => {
	if (definition.type === "maxPerRange") {
		return new MaxPerRange(definition as MaxPerRangeDefinition)
	}
}

export default parse
