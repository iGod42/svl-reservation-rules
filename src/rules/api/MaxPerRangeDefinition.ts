import { Hour } from "./Hour"

export interface MaxPerRangeDefinition {
	type: "maxPerRange"
	maximum: number
	dayRange?: number | "EOW"
	dayOffset?: number | "SOW"
	applyToWeekdays?: number[]
	startAtHour?: Hour
	endAtHour?: Hour
	startAtReservationDay?: boolean
	limitForUser?: boolean
	offsetStart?: number | "no" | "start-of-next-week"
}
