import { trimTimeComponent } from "./trimTimeComponent"

export const getBeginningOfWeek = (date: Date = new Date()): Date => {
	const d = trimTimeComponent(date)
	const day = d.getDay(),
		diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
	return new Date(d.setDate(diff))
}
