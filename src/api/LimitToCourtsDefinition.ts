import { Hour } from "./Hour"

export interface LimitToCourtsDefinition {
	type: "limitToCourts"
	courtIds: number[]
	afterHour?: Hour
	weekDays?: number[]
}
