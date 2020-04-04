import {trimTimeComponent, addDays, getBeginningOfWeek} from "../tools"
import {getFilterForSameUser} from "./helpers"
import {IRule} from "api"

type MaxPerRangeOptions = {
	dayRange: number | "EOW",
	dayOffset: number,
	applyToWeekdays: number[],
	startAtHour: number,
	endAtHour: number,
	startAtReservationDay: boolean,
	limitForUser: boolean,
	today: Date
}

type MaxPerRangeOptionsParams = {
	dayRange?: number | "EOW",
	dayOffset?: number,
	applyToWeekdays?: number[],
	startAtHour?: number,
	endAtHour?: number,
	startAtReservationDay?: boolean,
	limitForUser?: boolean,
	today?: Date
}

const defaultOptions: MaxPerRangeOptions = {
	dayRange: 1,
	dayOffset: 0,
	startAtHour: 0,
	endAtHour: 24,
	applyToWeekdays: [0, 1, 2, 3, 4, 5, 6],
	startAtReservationDay: false,
	today: new Date(),
	limitForUser: true
}

export const maxPerRange = (maximum: number, passedOptions?: MaxPerRangeOptionsParams): IRule => (reservation, allReservations) => {
	
	const options: MaxPerRangeOptions = {
		...defaultOptions,
		...passedOptions
	}
	
	const today = trimTimeComponent(options.startAtReservationDay ? reservation.Stunde : options.today)
	const eow = options.dayRange === "EOW"
	const startDate = addDays(today, options.dayOffset)
	
	// this could be to startDate > endDate in which case nothing is considered which is correct
	const endDate = eow ? addDays(getBeginningOfWeek(today), 7) : addDays(startDate, <number>options.dayRange)
	
	if (reservation.Stunde < startDate || reservation.Stunde >= endDate)
		return false
	
	const hour = reservation.Stunde.getHours()
	if (hour < options.startAtHour || hour >= options.endAtHour)
		return false
	
	const sameUserFilter = !options.limitForUser ? () => true : getFilterForSameUser(reservation)
	
	return (allReservations || [])
		.filter(sameUserFilter)
		.filter(res => res.Stunde >= startDate)
		.filter(res => res.Stunde < endDate)
		.filter(res => res.Stunde.getHours() >= options.startAtHour)
		.filter(res => res.Stunde.getHours() < options.endAtHour)
		.filter(res => options.applyToWeekdays.includes(res.Stunde.getDay()))
		.length < maximum ? false :
		`Maximum number of reservations between ${startDate} and ${endDate} from ${options.startAtHour} to ${options.endAtHour} on weekdays ${JSON.stringify(options.applyToWeekdays)} exceeded`
}