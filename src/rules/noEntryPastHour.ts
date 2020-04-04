import {IRule} from "../api"

export const noEntryPastHour = (hour: number, weekDays = [0, 1, 2, 3, 4, 5, 6]): IRule => (reservation) => {
	const std = reservation.Stunde
	if (std.getHours() >= hour && weekDays.includes(std.getDay()))
		return `Keine Reservierungen ab ${hour} Uhr erlaubt`
	return false
}