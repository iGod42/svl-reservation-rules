import {addDays, getBeginningOfWeek, trimTimeComponent} from "../tools"
import {IRule} from "api"

export const noEntryAfterWeek = (offsetWeeks = 0): IRule => (reservation) => {
	const targetDate = reservation.Stunde
	const cutoffDate = trimTimeComponent(addDays(getBeginningOfWeek(new Date()), 7 * (offsetWeeks + 1)))
	
	if (cutoffDate < targetDate)
		return `Eintragung darf max ${offsetWeeks} Woche(n) in die Zukunft stattfinden`
	return false
}