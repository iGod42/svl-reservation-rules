export interface NoEntryPastHourDefinition {
	type: "noEntryPastHour"
	hour: number
	weekDays?: number[]
}
