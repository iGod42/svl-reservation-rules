import { Hour } from "./Hour"

export interface LimitHoursDefinition {
	type: "limitHours"
	startHour: Hour
	endHour: Hour
}
