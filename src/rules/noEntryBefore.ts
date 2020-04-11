import { IRule } from "../api"

const MESSAGE = "Eintragen erst nach der angefangenen hour möglich"

export const noEntryBefore = (dayOffset = 0): IRule => reservation => {
	const now = new Date()
	// get start of current hour
	const compHour = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		now.getHours() + 1,
		0,
		0,
		0
	)
	// apply offset
	compHour.setDate(compHour.getDate() - dayOffset)

	if (reservation.hour < compHour) return MESSAGE

	return false
}
