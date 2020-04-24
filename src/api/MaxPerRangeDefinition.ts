import { Hour } from "./Hour"

export interface MaxPerRangeDefinition {
	type: "maxPerRange"
	maximum: number
	dayRange?: number | "EOW"
	dayOffset?: number
	applyToWeekdays?: number[]
	startAtHour?: Hour
	endAtHour?: Hour
	startAtReservationDay?: boolean
	limitForUser?: boolean
	today?: Date
}
