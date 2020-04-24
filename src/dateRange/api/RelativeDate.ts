export interface RelativeDateCalculation {
	(referenceDate: Date): Date
}

export interface RelativeDateDefinition {
	reference: "raw" | "startOfDay" | "beginningOfWeek" | "endOfWeek"
	dayOffset?: number
}
