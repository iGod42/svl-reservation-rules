import { IRule } from "../api"

export const limitToCourts = (
	courtIds: number[],
	hour = 0,
	weekDays = [0, 1, 2, 3, 4, 5, 6]
): IRule => reservation => {
	const std = reservation.Stunde
	const court = reservation.PlatzID

	if (!weekDays.includes(std.getDay())) return false

	if (!courtIds.includes(court)) return false

	if (std.getHours() < hour) return false

	return `Keine Reservierung von Platz${court}${
		hour > 0 ? ` nach ${hour} Uhr` : ""
	} erlaubt`
}
